import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ToolCall {
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, doctorId, clinicId } = await req.json();

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const systemPrompt = `Tu es l'assistant virtuel d'une clinique médicale au Maroc. Tu parles uniquement en français.

Tu peux aider avec:
- Créer des rendez-vous (demande le nom du patient, la date et l'heure)
- Rechercher des patients par nom ou téléphone
- Consulter les rendez-vous d'un jour donné
- Annuler ou modifier des rendez-vous
- Répondre aux questions sur les horaires de la clinique

Quand tu dois exécuter une action, utilise les outils disponibles. Sois concis et professionnel.
Aujourd'hui nous sommes le ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.

Contexte:
- ID du docteur: ${doctorId || 'non spécifié'}
- ID de la clinique: ${clinicId || 'non spécifié'}`;

    const tools = [
      {
        type: "function",
        function: {
          name: "search_patient",
          description: "Rechercher un patient par nom ou numéro de téléphone",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string", description: "Nom ou téléphone du patient" }
            },
            required: ["query"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "create_appointment",
          description: "Créer un nouveau rendez-vous pour un patient",
          parameters: {
            type: "object",
            properties: {
              patient_name: { type: "string", description: "Nom complet du patient" },
              patient_phone: { type: "string", description: "Numéro de téléphone du patient" },
              date: { type: "string", description: "Date au format YYYY-MM-DD" },
              time: { type: "string", description: "Heure au format HH:MM" },
              notes: { type: "string", description: "Notes optionnelles" }
            },
            required: ["patient_name", "date", "time"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_appointments",
          description: "Obtenir les rendez-vous pour une date donnée",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string", description: "Date au format YYYY-MM-DD" }
            },
            required: ["date"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "cancel_appointment",
          description: "Annuler un rendez-vous existant",
          parameters: {
            type: "object",
            properties: {
              appointment_id: { type: "string", description: "ID du rendez-vous à annuler" }
            },
            required: ["appointment_id"]
          }
        }
      }
    ];

    // First API call with tools
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tools,
        tool_choice: "auto",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message;

    // Check if the model wants to call tools
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      const toolResults: { role: string; tool_call_id: string; content: string }[] = [];

      for (const toolCall of assistantMessage.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        
        console.log(`Executing tool: ${functionName}`, args);

        let result: string;

        switch (functionName) {
          case "search_patient": {
            const { data: patients, error } = await supabase
              .from("patients")
              .select("*")
              .or(`full_name.ilike.%${args.query}%,phone.ilike.%${args.query}%`)
              .limit(5);

            if (error) {
              result = `Erreur lors de la recherche: ${error.message}`;
            } else if (!patients || patients.length === 0) {
              result = `Aucun patient trouvé pour "${args.query}"`;
            } else {
              result = `Patients trouvés:\n${patients.map((p: any) => 
                `- ${p.full_name} (Tél: ${p.phone}, ID: ${p.id})`
              ).join('\n')}`;
            }
            break;
          }

          case "create_appointment": {
            // First, find or create the patient
            let patientId: string;
            
            const { data: existingPatients } = await supabase
              .from("patients")
              .select("id")
              .ilike("full_name", `%${args.patient_name}%`)
              .limit(1);

            if (existingPatients && existingPatients.length > 0) {
              patientId = existingPatients[0].id;
            } else {
              // Create new patient
              const { data: newPatient, error: patientError } = await supabase
                .from("patients")
                .insert({
                  full_name: args.patient_name,
                  phone: args.patient_phone || "0000000000"
                })
                .select("id")
                .single();

              if (patientError) {
                result = `Erreur lors de la création du patient: ${patientError.message}`;
                break;
              }
              patientId = newPatient.id;
            }

            // Create the appointment
            const appointmentDatetime = `${args.date}T${args.time}:00`;
            
            const { data: appointment, error: appointmentError } = await supabase
              .from("appointments")
              .insert({
                patient_id: patientId,
                doctor_id: doctorId,
                clinic_id: clinicId,
                appointment_datetime: appointmentDatetime,
                notes: args.notes || null,
                status: "pending"
              })
              .select()
              .single();

            if (appointmentError) {
              result = `Erreur lors de la création du rendez-vous: ${appointmentError.message}`;
            } else {
              result = `✅ Rendez-vous créé avec succès!\n- Patient: ${args.patient_name}\n- Date: ${new Date(appointmentDatetime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}\n- Heure: ${args.time}\n- ID: ${appointment.id}`;
            }
            break;
          }

          case "get_appointments": {
            const startDate = `${args.date}T00:00:00`;
            const endDate = `${args.date}T23:59:59`;

            const { data: appointments, error } = await supabase
              .from("appointments")
              .select(`
                id,
                appointment_datetime,
                status,
                notes,
                patients (full_name, phone)
              `)
              .gte("appointment_datetime", startDate)
              .lte("appointment_datetime", endDate)
              .eq("doctor_id", doctorId)
              .order("appointment_datetime");

            if (error) {
              result = `Erreur: ${error.message}`;
            } else if (!appointments || appointments.length === 0) {
              result = `Aucun rendez-vous prévu pour le ${new Date(args.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`;
            } else {
              result = `Rendez-vous du ${new Date(args.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}:\n${appointments.map((a: any) => {
                const time = new Date(a.appointment_datetime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const patient = a.patients;
                return `- ${time}: ${patient?.full_name || 'Patient inconnu'} (${a.status})`;
              }).join('\n')}`;
            }
            break;
          }

          case "cancel_appointment": {
            const { error } = await supabase
              .from("appointments")
              .update({ status: "cancelled" })
              .eq("id", args.appointment_id);

            if (error) {
              result = `Erreur lors de l'annulation: ${error.message}`;
            } else {
              result = `✅ Rendez-vous ${args.appointment_id} annulé avec succès`;
            }
            break;
          }

          default:
            result = `Outil inconnu: ${functionName}`;
        }

        toolResults.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result
        });
      }

      // Second API call with tool results
      const finalResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            assistantMessage,
            ...toolResults
          ],
        }),
      });

      if (!finalResponse.ok) {
        const errorText = await finalResponse.text();
        console.error("AI gateway error (final):", finalResponse.status, errorText);
        throw new Error(`AI gateway error: ${finalResponse.status}`);
      }

      const finalData = await finalResponse.json();
      const finalContent = finalData.choices?.[0]?.message?.content || "Désolé, je n'ai pas pu traiter votre demande.";

      return new Response(JSON.stringify({ content: finalContent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // No tool calls, return the response directly
    const content = assistantMessage?.content || "Désolé, je n'ai pas pu traiter votre demande.";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in clinic-assistant:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
