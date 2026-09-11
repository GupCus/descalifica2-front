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

      <section className="relative py-20 md:py-28 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="px-4 py-1.5 text-xs md:text-sm font-medium border-primary/50 bg-primary/10 text-primary-foreground flex items-center gap-2 rounded-full backdrop-blur-sm"
            >
              <GraduationCap className="size-4 text-primary" />
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
              className="h-16 md:h-20 w-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance"
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
            className="text-base md:text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed"
          >
            Una plataforma para la comunidad apasionada por las carreras:
            calendarios en tiempo real, telemetría y datos de escuderías, datos
            sobre las transmisiones en vivo y un foro de debate entre toda la
            comunidad.
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20 relative z-10">
        <section className="grid md:grid-cols-2 gap-8 items-stretch">
          <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="size-11 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-2">
                <Sparkles className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Nuestra Misión
              </CardTitle>
              <CardDescription>
                Pasión y precisión para los fanáticos del automovilismo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
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

          <Card className="border-border/60 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <div className="size-11 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-2">
                <Activity className="size-6" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Ecosistema & Comunidad
              </CardTitle>
              <CardDescription>
                Una experiencia adaptada a tus preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
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

        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-semibold uppercase tracking-wider text-xs"
            >
              Módulos del Sistema
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              ¿Qué podés hacer en Descalifica2?
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Accedé de forma directa a cada uno de los módulos que componen la
              plataforma.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Card className="h-full border-border/60 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group">
                    <CardHeader>
                      <div className="size-10 rounded-md bg-primary/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-normal">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between text-muted-foreground group-hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Link to={feature.to}>
                          <span>Ingresar al módulo</span>
                          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-semibold uppercase tracking-wider text-xs"
            >
              Autores & Colaboradores
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Equipo de Desarrollo
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Estudiantes de Ingeniería en Sistemas de Información de la{" "}
              <strong className="text-foreground">UTN FRRo</strong> para la
              cátedra Desarrollo de Software (DSW - ISI 303).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="h-full flex flex-col"
              >
                <Card className="h-full flex flex-col justify-between text-center border-border/60 bg-card/50 hover:border-primary/50 hover:shadow-md transition-all duration-300">
                  <CardHeader className="flex flex-col items-center justify-between h-full pb-6">
                    <div className="flex flex-col items-center">
                      <Avatar className="size-16 border-2 border-primary/40 bg-muted/60 mb-3 shadow-inner">
                        <AvatarImage
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                        />
                        <AvatarFallback className="text-lg font-bold text-primary">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg font-bold leading-tight min-h-[3rem] flex items-center justify-center text-center">
                        {member.name}
                      </CardTitle>
                    </div>
                    <a
                      href={`https://github.com/${member.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-mono px-3 py-1 rounded-full border border-border/80 bg-background/50 hover:border-primary/50"
                    >
                      <Github className="size-3.5" />
                      <span>@{member.github}</span>
                    </a>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-semibold uppercase tracking-wider text-xs"
            >
              Arquitectura
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Tecnologías Utilizadas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <Card
                  key={tech.category}
                  className="border-border/60 bg-card/50"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-md bg-primary/20 text-primary flex items-center justify-center">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle className="text-lg font-bold">
                        {tech.category}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tech.items.map((item) => (
                        <Badge
                          key={item}
                          variant="secondary"
                          className="px-3 py-1 text-xs font-medium bg-muted/80 hover:bg-muted transition-colors"
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

        <section className="p-8 rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card/90 to-primary/10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Layers className="size-6 text-primary" />
                Código Fuente y Documentación
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Explorá los repositorios del proyecto y la propuesta académica
                presentada.
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-primary text-primary font-semibold"
            >
              Open Source
            </Badge>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <a
              href="https://github.com/GupCus/descalifica2-front"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl border border-border/80 bg-background/60 hover:border-primary/80 hover:bg-background/90 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center group-hover:text-primary transition-colors">
                  <Code2 className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Repo del Frontend</p>
                  <p className="text-xs text-muted-foreground">
                    React + TypeScript
                  </p>
                </div>
              </div>
              <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a
              href="https://github.com/GupCus/descalifica2-back"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl border border-border/80 bg-background/60 hover:border-primary/80 hover:bg-background/90 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center group-hover:text-primary transition-colors">
                  <Server className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Repo del Backend</p>
                  <p className="text-xs text-muted-foreground">
                    Express + TypeScript + MikroORM
                  </p>
                </div>
              </div>
              <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a
              href="https://github.com/GupCus/tp/blob/main/proposal.md"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-xl border border-border/80 bg-background/60 hover:border-primary/80 hover:bg-background/90 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-muted flex items-center justify-center group-hover:text-primary transition-colors">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Proposal</p>
                  <p className="text-xs text-muted-foreground">
                    Documento de Cátedra
                  </p>
                </div>
              </div>
              <ExternalLink className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>
        </section>

        <div className="text-center text-muted-foreground pt-10 border-t border-border/40 space-y-2">
          <p className="text-sm md:text-base flex items-center justify-center gap-1.5 font-medium">
            Desarrollado con{" "}
            <Heart className="size-4 text-red-500 fill-red-500 inline" /> en UTN
            Facultad Regional Rosario
          </p>
          <p className="text-xs text-muted-foreground/80">
            Ingeniería en Sistemas de Información • Cátedra Desarrollo de
            Software (ISI 303) • 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
