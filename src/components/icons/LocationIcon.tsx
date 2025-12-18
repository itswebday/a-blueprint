import { twMerge } from "tailwind-merge";

export type LocationIconProps = {
  className?: string;
};

const LocationIcon: React.FC<LocationIconProps> = ({ className }) => {
  return (
    <figure className={twMerge(className)}>
      <svg
        className="w-full h-full"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 
          8 0 1111.314 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
};

export default LocationIcon;
