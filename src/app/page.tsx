import Carousel from "@/components/carousel";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Endless Image Carousel</h1>
      <Carousel />
    </main>
  );
}
