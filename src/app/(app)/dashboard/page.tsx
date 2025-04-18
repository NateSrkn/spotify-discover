import * as Trending from "@/components/Trending";

export default async function Dashboard({ searchParams }) {
  const { time_range, type } = await searchParams;
  return (
    <section className="flex flex-col gap-4">
      <Trending.Root time_range={time_range} type={type}>
        <Trending.Controls />
        <Trending.List />
      </Trending.Root>
    </section>
  );
}
