export default function Page({ params }: any) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <iframe src={`/pdf/${params.id}`} width="100%" height="100%" />
    </div>
  );
}
