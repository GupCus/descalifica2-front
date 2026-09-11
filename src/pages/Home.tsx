import TextType from '@/components/ui/TextType.tsx';
import { Carrera } from '@/entities/carrera.entity.ts';
import PostRecomendados from '@/components/PostsRecomendados.tsx';
import { getCarrera } from '@/services/carrera.service.ts';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import bgFerrari from '@/assets/ferrari-lluvia-sainz.jpg';
import { Driver_Championship } from '@/entities/driver_championship.entity.ts';
import { Team_Championship } from '@/entities/team_championship.entity.ts';
import {
  getdrivers_championship,
  getteam_championship,
} from '@/services/championship.service.ts';
import TableChampionship from '@/components/tablechampionship.tsx';
import AccordionCarreras from '@/components/AccordionCarreras.tsx';
import { Escuderia } from '@/entities/escuderia.entity.ts';
import { getEscuderia } from '@/services/escuderia.service.ts';

function calcularcarrerasAnteriores(anio: number, carreras: Carrera[]) {
  let carrerasAnteriores;
  if (anio === new Date().getFullYear()) {
    carrerasAnteriores =
      !carreras || carreras.length === 0
        ? undefined
        : carreras
            .filter(
              (c) =>
                new Date(c.start_date) <= new Date() &&
                !c.name.includes('Testing'),
            )
            .sort(
              (a, b) =>
                new Date(b.start_date).getTime() -
                new Date(a.start_date).getTime(),
            );
  } else {
    return carreras
      .filter((c) => !c.name.includes('Testing'))
      .sort(
        (a, b) =>
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
      );
  }
  return carrerasAnteriores;
}
function Home() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasAnteriores, setCarrerasAnteriores] = useState<Carrera[]>([]);

  const [escuderias, setEscuderias] = useState<Escuderia[]>([]);

  const [driverschampionship, setdriverschampionship] = useState<
    Driver_Championship[]
  >([]);
  const [teamchampionship, setteamchampionship] = useState<Team_Championship[]>(
    [],
  );
  const [anio, setanio] = useState<number>(new Date().getFullYear());
  const [activeSection, setActiveSection] = useState<
    'torneo' | 'carreras' | 'posts'
  >('carreras');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    getdrivers_championship()
      .then((data) => setdriverschampionship(data))
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
    getteam_championship()
      .then((data) => setteamchampionship(data))
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
    getEscuderia()
      .then((data) => setEscuderias(data))
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getCarrera(anio)
      .then((data) => {
        setCarreras(data);
        setCarrerasAnteriores(calcularcarrerasAnteriores(anio, data) || []);
      })
      .catch((err) => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, [anio]);

  if (loading) {
    return (
      <div>
        <Inicio />
        <div>
          <h4 className="text-xl font-semibold tracking-tight mt-5 mb-5 text-center">
            Últimos grandes premios:{' '}
          </h4>
          <div className="min-h-[50vh] flex items-center justify-center">
            <Spinner className="size-8" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <Inicio />
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-red-400 text-lg">
            Error cargando carreras, recargá la página
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Inicio />

      <div className="w-full px-[5%] py-4">
        <div className="flex lg:hidden w-full justify-center mb-5">
          <ToggleGroup
            type="single"
            value={activeSection}
            onValueChange={(val) => {
              if (val) setActiveSection(val as 'torneo' | 'carreras' | 'posts');
            }}
            className="bg-muted rounded-md overflow-hidden"
          >
            <ToggleGroupItem value="torneo">Torneo</ToggleGroupItem>
            <ToggleGroupItem value="carreras">Carreras</ToggleGroupItem>
            <ToggleGroupItem value="posts">Posts</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_5fr_2fr] gap-8 items-start w-full">
          <div
            className={`w-full ${activeSection === 'torneo' ? 'block' : 'hidden'} lg:block`}
          >
            <TableChampionship
              drivers={driverschampionship}
              teams={teamchampionship}
              escuderiasdata={escuderias}
            />
          </div>
          <div
            className={`w-full ${activeSection === 'carreras' ? 'block' : 'hidden'} lg:block`}
          >
            <AccordionCarreras
              carrerasAnteriores={carrerasAnteriores}
              escuderiasdata={escuderias}
              setanio={setanio}
              anio={anio}
            />
          </div>
          <div
            className={`w-full ${activeSection === 'posts' ? 'block' : 'hidden'} lg:block`}
          >
            <PostRecomendados />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;

function Inicio() {
  return (
    <div className="relative pt-20 pb-20 text-center flex flex-col justify-center items-center overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full z-0 blur-[3px]"
        style={{
          backgroundImage: `url(${bgFerrari})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 px-4 w-full max-w-5xl mx-auto">
        <div className="min-h-[130px] md:min-h-[160px] flex flex-col justify-center">
          <TextType
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary-foreground"
            text={[
              'Bienvenido al mejor foro sobre automovilismo.',
              'Welcome to the best motorsport forum.',
              'Willkommen im berühmtesten Motorsportforum.',
              'Bem-vindo ao mais mejor fórum do automobilismo',
              'モータースポーツに関する最高のフォーラムへようこそ',
            ]}
            typingSpeed={75}
            pauseDuration={3500}
            showCursor={true}
            cursorCharacter="_"
          />
        </div>
        <h3 className="text-primary-foreground mt-5 scroll-m-20 text-lg md:text-xl font-semibold tracking-tight text-center">
          En descalifica2 vas a encontrar toda la información que necesitás para
          tu deporte motor favorito.
        </h3>
      </div>
    </div>
  );
}
