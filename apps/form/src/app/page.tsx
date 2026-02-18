export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-foreground">
          NaiveForm
        </h1>
        <p className="mt-2 text-muted-foreground">
          Use a form link to respond (e.g. /your-form-slug).
        </p>
      </div>
    </div>
  );
}
