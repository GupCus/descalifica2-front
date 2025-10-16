import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function About() {

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 w-full h-full z-0 blur-sm opacity-30"
        style={{
          backgroundImage: "url('https://media.formula1.com/image/upload/t_16by9South/c_lfill,w_3392/q_auto/v1740000000/fom-website/2025/F1%2075%20Live/GettyImages-2200471441.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    
    <div className="flex flex-col gap-12 py-16 px-4 max-w-6xl mx-auto relative z-10 justify-center items-center min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary-foreground">📝 Sobre el Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg leading-relaxed">
          <p>
            Descalifica2 es un sitio web dedicado principalmente a la Fórmula 1,
            donde podrás consultar el calendario de carreras, acceder a información detallada sobre cada evento
            y mantenerte al día con las noticias sobre automovilismo.
          </p>
          <p>
            El objetivo del sitio es mantener informada a toda la comunidad amante del deporte automotor,
            brindando las fechas de cada Gran Premio, dónde verlo en vivo, y datos sobre las escuderías
            participantes junto a sus pilotos.
          </p>
          <p>
            Los usuarios pueden crear un perfil personalizado, indicando su nombre, escuderías, circuitos
            y pilotos favoritos para adaptar su experiencia en la plataforma. Además, podrán participar en
            un foro donde intercambiar opiniones, debatir y compartir su pasión con otros
            fanáticos.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary-foreground">👥 Integrantes</CardTitle>
            <CardDescription>
              UTN FRRo - Cátedra DSW - ISI 303 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
                <li>Barroso Bollero, Agustín</li>
                <li>Figueroa, Francisco</li>
                <li>Taborda, Ignacio</li>
                <li>Taborda, Santiago</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary-foreground">🛠️ Tecnologías</CardTitle>
            <CardDescription>Algunas de las tecnologías del proyecto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">

                <Badge variant="default" className="text-base px-4 py-2">
                  React
                </Badge>
                            
                <Badge variant="default" className="text-base px-4 py-2">
                  TypeScript
                </Badge>
                            
                <Badge variant="default" className="text-base px-4 py-2">
                  shadcn/ui
                </Badge>
                            
                <Badge variant="default" className="text-base px-4 py-2">
                  Tailwind CSS
                </Badge>

            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 text-primary-foreground">
          🕵️ ¿Qué podés hacer en el sitio?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                📅 Calendario
              </CardTitle>
            </CardHeader>
            <CardContent>
              Consulta todas las fechas de los Grandes Premios de la temporada con información detallada.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                📚 Wiki
              </CardTitle>
            </CardHeader>
            <CardContent>
              Información completa sobre pilotos, escuderías, circuitos y temporadas.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                📺 ¿Dónde Ver?
              </CardTitle>
            </CardHeader>
            <CardContent>
              Descubre dónde y cómo ver cada Gran Premio en vivo.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                👤 Perfil Personalizado (Próximamente)
              </CardTitle>
            </CardHeader>
            <CardContent>
              Crea tu perfil indicando tus escuderías, pilotos y circuitos favoritos.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                💬 Foro (Próximamente)
              </CardTitle>
            </CardHeader>
            <CardContent>
              Comparte tu pasión con otros fanáticos en nuestro foro de discusión.
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                📰 Noticias (Próximamente)
              </CardTitle>
            </CardHeader>
            <CardContent>
              Mantente actualizado con las últimas noticias del mundo del automovilismo.
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/40 to-accent/40">
        <CardHeader>
          <CardTitle className="text-2xl text-primary-foreground">🔗 Links del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://github.com/GupCus/tp/blob/main/proposal.md"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            📄 Ver Proposal
          </a>
          <a
            href="https://github.com/GupCus/descalifica2-back"
            className="px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold"
          >
            🔧 Repositorio Backend
          </a>
          <a
            href="https://github.com/GupCus/descalifica2-front"
            className="px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold"
          >
            🖼️ Repositorio Frontend
          </a>
        </CardContent>
      </Card>

      <div className="text-center text-muted-foreground pt-8 border-t">
        <p className="text-lg">
          Desarrollado con ❤️ en UTN FRRo
        </p>
        <p className="text-sm mt-2">ISI 303 - Desarrollo de Software - 2025</p>
      </div>
    </div>
  </div>
  );
}

export default About;
