import Image from 'next/image';

export default function MainHero() {
  return (
    <section className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[18rem] h-[16rem] sm:w-[29rem] sm:h-[20rem]  md:w-[21rem] md:h-[23rem]">
          <Image
            src="/typing.jpg"
            fill
            alt="Hero Image"
            className="object-contain"
            sizes="(min-width: 780px) 336px, (min-width: 640px) 464px, 288px"
          />
        </div>
      </div>
    </section>
  );
}
