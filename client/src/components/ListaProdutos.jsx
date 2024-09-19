export default function ListaProdutos(props) {
    return (
        <div className="max-w-screen-lg mx-auto">
            <ul className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
                <li className="flex justify-between bg-gray-100 px-4 py-3">
                    <p className="font-bold text-gray-700">{props.name}</p>
                    <p className="text-gray-600">{props.cost}</p>
                    <p className="text-gray-600">{props.category}</p>
                    <p className="text-gray-600">{props.quantidade}</p>
                </li>
            </ul>
        </div>
    );
}
