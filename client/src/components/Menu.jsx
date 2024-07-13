import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Menu() {
    return (
        <div className="flex justify-center items-center mt-9">
            <Link to='/novopedido'>
                <button
                    type="button"
                    className="w-60 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    <span className="text-center">Novo Pedido</span>
                    </button>
            </Link>
        </div>
    );
}
