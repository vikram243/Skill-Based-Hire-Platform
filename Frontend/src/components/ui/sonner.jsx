import { Toaster as Sonner } from "sonner";
import { useUI } from "../../contexts/ui-context";

const Toaster = (props) => {
  const { isDarkMode } = useUI();
  const theme = isDarkMode ? "dark" : "light";

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
};

export default Toaster;