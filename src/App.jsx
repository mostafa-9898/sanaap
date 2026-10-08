import { SignupForm } from "./components/form";

export default function App() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-md">
        <header className="flex h-36 items-start justify-center rounded-b-[2.5rem] bg-brand pt-6 text-white">
          <div className="text-center leading-tight">
            <p className="text-3xl font-black">بیمه دی</p>
            <p className="text-[10px] tracking-[0.3em]">day insurance</p>
          </div>
        </header>
        <div className="-mt-16 px-4 pb-10">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}
