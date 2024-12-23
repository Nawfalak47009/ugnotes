import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden">
          <SignIn />
        </div>
  );
}
