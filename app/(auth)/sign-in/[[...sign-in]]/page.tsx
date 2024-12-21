import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="https://videocdn.cdnpk.net/videos/631b2360-d5a9-5a3a-ba11-d358426b6d59/horizontal/previews/clear/large.mp4?token=exp=1734777711~hmac=9d2c4af6cb6493c9ba34b1c7713315cb56c53485118394cbb982ac1ceb218e81"
        autoPlay
        loop
        muted
        playsInline // Ensures compatibility on mobile browsers
      ></video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Sign-In Component */}
      <div className=" flex items-center justify-center h-full px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
