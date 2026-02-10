const FullPageLoader = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">

      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-500 animate-spin"></div>
      </div>

      <p className="text-muted-foreground font-medium tracking-wide">
        Loading your experience...
      </p>

    </div>
  );
};

export default FullPageLoader;
