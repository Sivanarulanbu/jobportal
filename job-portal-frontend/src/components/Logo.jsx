import logo from "../assets/dreamroute_logo.jpg";

export default function Logo({ className = "w-10 h-10", showText = false }) {
  // The new logo includes the text "DreamRoute", so we don't need the separate text span anymore.
  // We can ignore the showText prop or use it to toggle specific classes if needed, 
  // but better to just show the image which contains everything.
  return (
    <div className="flex items-center gap-2">
      <img
        src={logo}
        alt="DreamRoute Logo"
        className={`${className} object-cover`}
      />
    </div>
  );
}
