import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const LoginButton = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link to="/auth">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/90 hover:bg-white text-islamic-green-dark shadow-lg"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
    </div>
  );
};

export default LoginButton;
