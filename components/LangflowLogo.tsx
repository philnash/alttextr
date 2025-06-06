import Image, { getImageProps } from "next/image";

export default function LangflowLogo() {
  const {
    props: { srcSet: darkProps },
  } = getImageProps({
    src: "/langflow.png",
    alt: "Langflow Logo",
    width: 128,
    height: 25,
  });

  return (
    <picture>
      <source media="(prefers-color-scheme: dark)" srcSet={darkProps} />
      {/* <source media="(prefers-color-scheme: light)" srcSet={lightProps} /> */}
      <Image
        src="/langflow-black.png"
        alt="Langflow Logo"
        height="25"
        width="128"
      />
    </picture>
  );
}
