import React from 'react';

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center">
        <img 
          src={appointment.image} 
          alt={appointment.name} 
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{appointment.name}</h3>
          <p className="text-sm text-gray-500">{appointment.description}</p>
        </div>
        <button className="text-gray-500">
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mt-4">
        <div className="flex items-center text-sm text-gray-500">
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8 7V3m8 4V3m-9 4h10M5 11h14v10H5V11z"
            />
          </svg>
          {appointment.date}
          <span className="ml-4">
            <svg 
              className="w-5 h-5 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 8v4l3 3"
              />
            </svg>
            {appointment.time}
          </span>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <button className="text-red-500">
            {appointment.status === 'rescheduled' ? 'Rescheduled' : 'Unconfirmed'}
          </button>
          <div>
            <button className="text-sm text-gray-500 mr-2">
              Cancel
            </button>
            <button className="bg-red-500 text-white text-sm px-4 py-1 rounded">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const appointments = [
  {
    image: 'https://via.placeholder.com/150',
    name: 'Marlyn Lee',
    description: 'General Tests - In Person',
    date: '16/10/2021',
    time: '11:30',
    status: 'rescheduled'
  },
  {
    image: 'https://via.placeholder.com/150',
    name: 'Frank Sacca',
    description: 'General Checkup - In Person',
    date: '16/10/2021',
    time: '11:30',
    status: 'unconfirmed'
  },
  {
    image: 'https://via.placeholder.com/150',
    name: 'Christina Kim',
    description: 'Coloring - In Person',
    date: '16/10/2021',
    time: '10:00',
    status: 'unconfirmed'
  }
];

const Card = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Appointments</h1>
      {appointments.map((appointment, index) => (
        <AppointmentCard key={index} appointment={appointment} />
      ))}
    </div>
  );
};

export default Card;