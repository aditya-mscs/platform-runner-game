import Game from "@/components/game"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <h1 className="mb-6 text-4xl font-bold text-white">PLATRUNNER</h1>
      <Game />
      <div className="mt-6 text-white">
        <p className="mb-2 text-center">Controls: Arrow keys to move, Space to jump</p>
        <p className="text-center">Reach the green goal while avoiding red spikes!</p>
      </div>
    </main>
  )
}

