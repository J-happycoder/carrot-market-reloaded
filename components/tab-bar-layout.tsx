import TabBar from "./tab-bar";

export default function TabBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <TabBar />
    </>
  );
}
