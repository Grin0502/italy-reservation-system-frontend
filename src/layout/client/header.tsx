import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="code-section bg-black/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold">
                            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Tavly</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;