/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    safelist: [
        'bg-teal-600',
        'bg-orange-600',
        'bg-sky-600',
        'bg-yellow-600',
        'bg-violet-600',
        'bg-rose-600',
        'bg-stone-600',
        'hover:bg-teal-600',
        'hover:bg-orange-600',
        'hover:bg-sky-600',
        'hover:bg-yellow-600',
        'hover:bg-violet-600', 
        'hover:bg-rose-600',    
        'hover:bg-stone-600', 
    ]
};
