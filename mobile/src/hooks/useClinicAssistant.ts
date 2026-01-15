import { useState, useRef, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseClinicAssistantOptions {
  doctorId?: string;
  clinicId?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

export const useClinicAssistant = (options: UseClinicAssistantOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const sendMessage = useCallback(async (text: string): Promise<string | undefined> => {
    if (!text.trim()) return undefined;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinic-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMessage],
            doctorId: options.doctorId,
            clinicId: options.clinicId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = { role: "assistant", content: data.content };
      setMessages(prev => [...prev, assistantMessage]);

      return data.content;
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Désolé, une erreur s'est produite. Veuillez réessayer." 
      };
      setMessages(prev => [...prev, errorMessage]);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, [messages, options.doctorId, options.clinicId]);

  const speakText = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      options.onSpeakStart?.();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`TTS Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Play the audio using data URI
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        options.onSpeakEnd?.();
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        options.onSpeakEnd?.();
      };

      await audio.play();
    } catch (error) {
      console.error("Error speaking text:", error);
      setIsSpeaking(false);
      options.onSpeakEnd?.();
    }
  }, [options]);

  // Use browser's Web Speech API for speech recognition (French)
  const startRecording = useCallback(() => {
    try {
      // Check if SpeechRecognition is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.error("Speech recognition not supported in this browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log("Transcription:", transcript);
        
        if (transcript && transcript.trim()) {
          setIsLoading(true);
          try {
            const assistantResponse = await sendMessage(transcript);
            if (assistantResponse) {
              await speakText(assistantResponse);
            }
          } finally {
            setIsLoading(false);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      setIsRecording(true);
      
      // Store reference for stopping
      recognitionRef.current = recognition;
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  }, [sendMessage, speakText]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
    options.onSpeakEnd?.();
  }, [options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    isRecording,
    isSpeaking,
    sendMessage,
    speakText,
    startRecording,
    stopRecording,
    stopSpeaking,
    clearMessages,
  };
};
