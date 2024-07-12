import React from 'react';

const ModalListUser = ({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div className="bg-white p-8 rounded shadow-lg z-50">
                <p className="text-xl font-semibold mb-4">Tem certeza que deseja cancelar este Pedido?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onCancel}
                        className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalListUser;
