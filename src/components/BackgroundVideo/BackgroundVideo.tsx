import { twMerge } from "tailwind-merge";
import { getTranslations } from "next-intl/server";

type BackgroundVideoProps = {
  className?: string;
  src: string;
  alt: string;
};

const getVideoType = (src: string): string => {
  const extension = src.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "webm":
      return "video/webm";
    case "mp4":
      return "video/mp4";
    case "mov":
      return "video/quicktime";
    case "ogg":
      return "video/ogg";
    default:
      return "video/webm";
  }
};

const BackgroundVideo: React.FC<BackgroundVideoProps> = async ({
  className,
  src,
  alt,
}) => {
  const generalT = await getTranslations("general");

  return (
    <figure className={twMerge("absolute inset-0 z-0", className)}>
      {/* Video */}
      <video
        className=" w-full h-full object-cover"
        aria-label={alt}
        autoPlay={true}
        loop={true}
        muted={true}
        playsInline={true}
        disablePictureInPicture={true}
        disableRemotePlayback={true}
        preload="metadata"
      >
        <source src={src} type={getVideoType(src)} />
        {generalT("videoTagNotSupported")}
      </video>
    </figure>
  );
};

export default BackgroundVideo;
