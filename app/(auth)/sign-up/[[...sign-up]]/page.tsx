import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://videocdn.cdnpk.net/videos/ca281a39-01e2-589b-a581-fc1b335fd6cb/horizontal/previews/clear/large.mp4?token=exp=1734777040~hmac=c309698711ee5a09eed6365bbe58fe99c5e0c3cac4f42edf6fa115914b7c1b93"
        autoPlay
        loop
        muted
        playsInline // Ensures compatibility on mobile devices
      ></video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Sign-Up Component */}
      <div className=" flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
