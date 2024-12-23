import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="relative h-screen flex items-center justify-center w-screen mt-7">
          <SignUp />
        </div>
  );
}
