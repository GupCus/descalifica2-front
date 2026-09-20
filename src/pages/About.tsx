import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Trophy,
  Tv,
  MessageSquare,
  UserCheck,
  Timer,
  ExternalLink,
  FileText,
  Code2,
  Sparkles,
  Layers,
  ArrowRight,
  Activity,
  GraduationCap,
  Heart,
  Server,
  ShieldCheck,
  Github,
} from "lucide-react";
import logoDescalifica2 from "@/assets/descalifica2logo.png";
import bgGrilla from "@/assets/grilla-cola-2021.jpg";

// Datos de funcionalidades del sitio
const features = [
  {
    title: "Calendario Oficial",
    description:
      "Fechas, cronogramas de prácticas, clasificación y carrera de cada Gran Premio de la temporada.",
    icon: Calendar,
    to: "/calendario",
  },
  {
    title: "Wiki & Estadísticas",
    description:
      "Información sobre pilotos, escuderías, marcas y trazados históricos del mundial.",
    icon: Trophy,
    to: "/pilotos",
  },
  {
    title: "¿Dónde Ver?",
    description:
      "Guía completa con señales televisivas y plataformas oficiales de streaming para no perderte nada.",
    icon: Tv,
    to: "/dondever",
  },
  {
    title: "Foro de la Comunidad",
    description:
      "Debatí sobre decisiones de comisarios, rendimientos, rumores de fichajes y compartí tu opinión.",
    icon: MessageSquare,
    to: "/foro",
  },
  {
    title: "Perfil Personalizado",
    description:
      "Elegí tus pilotos, escuderías y circuitos favoritos para personalizar tu experiencia de usuario.",
    icon: UserCheck,
    to: "/perfil",
  },
  {
    title: "Campeonato & Tiempos",
    description:
      "Posiciones actualizadas de pilotos y constructores para seguir la batalla fecha tras fecha.",
    icon: Timer,
    to: "/",
  },
];

// Integrantes del equipo UTN FRRo
const team = [
  {
    name: "Agustín Barroso Bollero",
    github: "GupCus",
    avatar: "https://avatars.githubusercontent.com/u/109119314?v=4",
    initials: "AB",
  },
  {
    name: "Francisco Figueroa",
    github: "franfigit",
    avatar: "https://avatars.githubusercontent.com/u/206000176?v=4",
    initials: "FF",
  },
  {
    name: "Ignacio Taborda",
    github: "NachoTaborda",
    avatar: "https://avatars.githubusercontent.com/u/205359108?v=4",
    initials: "IT",
  },
  {
    name: "Santiago Taborda",
    github: "SantiTabordaa",
    avatar: "https://avatars.githubusercontent.com/u/205359456?v=4",
    initials: "ST",
  },
];

// Stack Tecnológico
const techStack = [
  {
    category: "Frontend & UI",
    icon: Code2,
    items: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "Framer Motion",
    ],
  },
  {
    category: "Backend & Datos",
    icon: Server,
    items: [
      "Node.js & Express",
      "TypeScript",
      "MikroORM",
      "MySQL",
      "OpenF1 Live API",
      "Axios Client",
    ],
  },
  {
    category: "Seguridad & Servicios",
    icon: ShieldCheck,
    items: [
      "JWT Auth",
      "Google OAuth 2.0",
      "Multer",
      "Bcrypt",
      "Protected Routes",
    ],
  },
];

function About() {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <div
        className="fixed inset-0 -z-30 w-full h-full pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgGrilla})`,
          filter: "blur(3px) brightness(0.35)",
          transform: "scale(1.05)",
        }}
      />

      <div className="fixed inset-0 -z-20 pointer-events-none bg-gradient-to-b from-background/75 via-background/90 to-background/98" />

      <div
        className="fixed inset-0 -z-10 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="fixed -top-24 left-1/4 -z-10 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 -right-24 -z-10 w-[450px] h-[450px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed -bottom-24 left-10 -z-10 w-[600px] h-[350px] bg-rose-950/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

      <section className="relative py-12 sm:py-20 md:py-28 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs md:text-sm font-medium border-primary/50 bg-primary/10 text-primary-foreground flex items-center gap-1.5 sm:gap-2 rounded-full backdrop-blur-sm"
            >
              <GraduationCap className="size-3.5 sm:size-4 text-primary" />
              UTN FRRo • Cátedra DSW • ISI 303 2025
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <img
              src={logoDescalifica2}
              alt="Logo Descalifica2"
              className="h-12 sm:h-16 md:h-20 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance"
          >
            El epicentro digital de la{" "}
            <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              Fórmula 1 y Motorsport
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed"
          >
            Una plataforma para la comunidad apasionada por las carreras:
            calendarios en tiempo real, telemetría y datos de escuderías, datos
            sobre las transmisiones en vivo y un foro de debate entre toda la
            comunidad.
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-16 space-y-12 sm:space-y-20 relative z-10">
        <section className="grid grid-cols-2 gap-3 sm:gap-8 items-stretch">
          <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300 py-3.5 sm:py-6 gap-2 sm:gap-6">
            <CardHeader className="px-3 sm:px-6 pb-0">
              <div className="size-8 sm:size-11 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-1.5 sm:mb-2">
                <Sparkles className="size-4 sm:size-6" />
              </div>
              <CardTitle className="text-base sm:text-2xl font-bold">
                Nuestra Misión
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Pasión y precisión para los fanáticos del automovilismo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pt-2 sm:pt-0 space-y-2 sm:space-y-3 text-xs sm:text-base text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Descalifica2</strong> nació
                con el fin de resolver la dispersión de datos en el mundo del
                deporte motor. Centralizamos fechas, horarios ajustados a tu
                zona horaria local, canales oficiales de transmisión y la ficha
                técnica de cada protagonista de la grilla.
              </p>
              <p>
                Buscamos que tanto el aficionado recién llegado como el seguidor
                experto encuentren información confiable y un entorno
                estimulante para el intercambio de puntos de vista.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300 py-3.5 sm:py-6 gap-2 sm:gap-6">
            <CardHeader className="px-3 sm:px-6 pb-0">
              <div className="size-8 sm:size-11 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-1.5 sm:mb-2">
                <Activity className="size-4 sm:size-6" />
              </div>
              <CardTitle className="text-base sm:text-2xl font-bold">
                Ecosistema & Comunidad
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Una experiencia adaptada a tus preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pt-2 sm:pt-0 space-y-2 sm:space-y-3 text-xs sm:text-base text-muted-foreground leading-relaxed">
              <p>
                Los usuarios registrados pueden personalizar su perfil eligiendo
                sus constructores, circuitos y pilotos preferidos, recibiendo
                recomendaciones y filtrando el contenido a su medida.
              </p>
              <p>
                El foro integrado permite debatir fallos de carrera, estrategias
                de neumáticos y novedades técnicas de cada monoplaza,
                fortaleciendo el lazo entre miembros de la comunidad.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-semibold uppercase tracking-wider text-[11px] sm:text-xs"
            >
              Módulos del Sistema
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              ¿Qué podés hacer en Descalifica2?
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
              Accedé de forma directa a cada uno de los módulos que componen la
              plataforma.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card className="h-full border-border/60 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group py-3 sm:py-6 gap-2 sm:gap-6">
                    <CardHeader className="px-3 sm:px-6 pb-0">
                      <div className="size-8 sm:size-10 rounded-md bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform mb-1.5 sm:mb-2">
                        <Icon className="size-4 sm:size-5" />
                      </div>
                      <CardTitle className="text-sm sm:text-xl font-bold group-hover:text-primary transition-colors leading-snug">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm leading-relaxed mt-1">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pt-2 sm:pt-0">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-muted-foreground group-hover:text-primary hover:bg-primary/10 transition-all px-2 sm:px-3 h-8 sm:h-9 text-xs sm:text-sm"
                      >
                        <Link to={feature.to}>
                          <span className="truncate">
                            Ingresar
                            <span className="hidden sm:inline"> al módulo</span>
                          </span>
                          <ArrowRight className="size-3.5 sm:size-4 shrink-0 group-hover:translate-x-1 transition-transform ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-semibold uppercase tracking-wider text-[11px] sm:text-xs"
            >
              Autores & Colaboradores
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Equipo de Desarrollo
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
              Estudiantes de Ingeniería en Sistemas de Información de la{" "}
              <strong className="text-foreground">UTN FRRo</strong> para la
              cátedra Desarrollo de Software (DSW - ISI 303).
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full flex flex-col"
              >
                <Card className="h-full flex flex-col justify-between text-center border-border/60 bg-card/50 hover:border-primary/50 hover:shadow-md transition-all duration-300 py-3 sm:py-6">
                  <CardHeader className="flex flex-col items-center justify-between h-full px-2 sm:px-6 pb-2 sm:pb-6 gap-2">
                    <div className="flex flex-col items-center w-full">
                      <Avatar className="size-12 sm:size-16 border-2 border-primary/40 bg-muted/60 mb-2 sm:mb-3 shadow-inner">
                        <AvatarImage
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="text-sm sm:text-lg font-bold text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-xs sm:text-lg font-bold leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center text-center px-1">
                        {member.name}
                      </CardTitle>
                    </div>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="mt-2 sm:mt-3 h-7 text-[11px] sm:text-xs font-mono px-2 sm:px-3 rounded-full border-border/80 bg-background/50 hover:border-primary/50 text-muted-foreground hover:text-primary max-w-full"
                    >
                      <a
                        href={`https://github.com/${member.github}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 sm:gap-1.5"
                      >
                        <Github className="size-3 sm:size-3.5 shrink-0" />
                        <span className="truncate">@{member.github}</span>
                      </a>
                    </Button>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-semibold uppercase tracking-wider text-[11px] sm:text-xs"
            >
              Arquitectura
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Tecnologías Utilizadas
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <Card
                  key={tech.category}
                  className={`border-border/60 bg-card/50 py-3 sm:py-6 gap-2 sm:gap-6 ${
                    idx === 2 ? "col-span-2 md:col-span-1" : ""
                  }`}
                >
                  <CardHeader className="px-3 sm:px-6 pb-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="size-7 sm:size-9 rounded-md bg-primary/20 text-primary flex items-center justify-center shrink-0">
                        <Icon className="size-3.5 sm:size-5" />
                      </div>
                      <CardTitle className="text-xs sm:text-lg font-bold leading-tight">
                        {tech.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pt-2 sm:pt-0">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {tech.items.map((item) => (
                        <Badge
                          key={item}
                          variant="secondary"
                          className="px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium bg-muted/80 hover:bg-muted transition-colors"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="p-4 sm:p-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card/90 to-primary/10 shadow-xl space-y-4 sm:space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <Layers className="size-5 sm:size-6 text-primary shrink-0" />
                <span>Código Fuente y Documentación</span>
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Explorá los repositorios del proyecto y la propuesta académica
                presentada.
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-primary text-primary font-semibold text-xs sm:text-sm"
            >
              Open Source
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 pt-2">
            <a
              href="https://github.com/GupCus/descalifica2-front"
              target="_blank"
              rel="noreferrer"
              className="p-3 sm:p-4 rounded-xl border border-border/80 bg-background/60 hover:border-primary/80 hover:bg-background/90 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
                <div className="size-8 sm:size-9 rounded-lg bg-muted flex items-center justify-center group-hover:text-primary transition-colors shrink-0">
                  <Code2 className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    Repo Frontend
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    React + TypeScript
                  </p>
                </div>
              </div>
              <ExternalLink className="size-3.5 sm:size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-end sm:self-center" />
            </a>

            <a
              href="https://github.com/GupCus/descalifica2-back"
              target="_blank"
              rel="noreferrer"
              className="p-3 sm:p-4 rounded-xl border border-border/80 bg-background/60 hover:border-primary/80 hover:bg-background/90 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto">
                <div className="size-8 sm:size-9 rounded-lg bg-muted flex items-center justify-center group-hover:text-primary transition-colors shrink-0">
                  <Server className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    Repo Backend
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Express + TS + ORM
                  </p>
                </div>
              </div>
              <ExternalLink className="size-3.5 sm:size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 self-end sm:self-center" />
            </a>

            <a
              href="https://github.com/GupCus/tp/blob/main/proposal.md"
              target="_blank"
              rel="noreferrer"
              className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-xl border border-border/80 bg-background/60 hover:border-primary/80 hover:bg-background/90 transition-all flex items-center justify-between group gap-2 sm:gap-3"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="size-8 sm:size-9 rounded-lg bg-muted flex items-center justify-center group-hover:text-primary transition-colors shrink-0">
                  <FileText className="size-4 sm:size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-xs sm:text-sm truncate">
                    Proposal
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Documento de Cátedra
                  </p>
                </div>
              </div>
              <ExternalLink className="size-3.5 sm:size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </a>
          </div>
        </section>

        <div className="pt-6 sm:pt-10 space-y-4">
          <Separator className="border-border/40" />
          <div className="text-center text-muted-foreground space-y-1.5 sm:space-y-2">
            <p className="text-xs sm:text-sm md:text-base flex items-center justify-center gap-1.5 font-medium">
              Desarrollado con{" "}
              <Heart className="size-3.5 sm:size-4 text-red-500 fill-red-500 inline" /> en UTN
              Facultad Regional Rosario
            </p>
            <p className="text-[11px] sm:text-xs text-muted-foreground/80">
              Ingeniería en Sistemas de Información • Cátedra Desarrollo de
              Software (ISI 303) • 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
