import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClinicAssistant } from "@/hooks/useClinicAssistant";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  VolumeX,
  Sparkles,
  Calendar,
  Users,
  Clock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { label: "Nouveau rendez-vous", icon: Calendar, text: "Je voudrais ajouter un nouveau rendez-vous pour demain à 10h." },
  { label: "Mes prochains RDV", icon: Clock, text: "Quels sont mes rendez-vous pour cet après-midi ?" },
  { label: "Liste d'attente", icon: Users, text: "Y a-t-il des patients en liste d'attente ?" },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

export function ClinicAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isLoading,
    isRecording,
    isSpeaking,
    sendMessage,
    startRecording,
    stopRecording,
    stopSpeaking,
    clearMessages,
  } = useClinicAssistant({
    onSpeakStart: () => setIsMuted(false),
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleOpen}
          size="lg"
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
            isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90 hover:shadow-primary/25"
          )}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <div className="relative">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-gold"></span>
              </span>
            </div>
          )}
        </Button>
      </div>

      {/* Modern Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[400px] animate-slide-up origin-bottom-right">
          <Card className="border-0 shadow-2xl overflow-hidden glass-card flex flex-col h-[600px] max-h-[80vh]">

            {/* Header */}
            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src="/lovable-uploads/salma-avatar.png" />
                    <AvatarFallback className="bg-white/10 text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-primary"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">Salma</h3>
                  <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Assistant ClinicFlow
                  </p>
                </div>
              </div>

              <div className="flex gap-1 relative z-10">
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                    onClick={stopSpeaking}
                    title="Arrêter la lecture"
                  >
                    <VolumeX className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
                  onClick={clearMessages}
                  title="Effacer la conversation"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50 backdrop-blur-sm scrollbar-thin"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-1 max-w-[80%]">
                    <h4 className="font-semibold text-foreground">
                      {getGreeting()} ! 👋
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Je suis <span className="font-medium text-primary">Salma</span>, votre assistante virtuelle. Comment puis-je vous aider ?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 w-full max-w-[90%]">
                    {SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion.text)}
                        className="flex items-center gap-3 p-3 text-sm text-left bg-white/60 hover:bg-white border border-border/40 hover:border-primary/30 rounded-xl transition-all shadow-sm hover:shadow-md group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <suggestion.icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-foreground/80 group-hover:text-primary transition-colors">
                          {suggestion.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-full animate-slide-up",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white border border-border/50 text-foreground rounded-tl-none"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border border-border/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-background border-t border-border/50 shrink-0">
              <div className="relative flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrivez votre message..."
                  className="pr-24 h-12 rounded-xl bg-muted/30 border-border/50 focus-visible:ring-primary/20"
                />

                <div className="absolute right-1.5 flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-9 w-9 rounded-lg transition-colors",
                      isRecording ? "text-destructive bg-destructive/10 hover:bg-destructive/20 animate-pulse" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )}
                    onClick={isRecording ? stopRecording : startRecording}
                    title={isRecording ? "Arrêter l'enregistrement" : "Enregistrer un message vocal"}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>

                  <Button
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-lg text-white shadow-sm transition-all",
                      !inputText.trim() ? "bg-muted-foreground/30" : "bg-primary hover:bg-primary-600"
                    )}
                    onClick={handleSend}
                    disabled={!inputText.trim() && !isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-[10px] text-center text-muted-foreground/50 mt-2">
                Propulsé par ClinicFlow AI
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
