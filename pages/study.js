import { useRouter } from "next/router";

const Study = () => {
  const router = useRouter();
  const { extractedData } = router.query;

  const data = extractedData ? JSON.parse(extractedData) : null;

  return (
    <div>
      <h1>Example Page</h1>
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default Study;
