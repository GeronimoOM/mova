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
        'bg-teal-500',
        'bg-orange-500',
        'bg-sky-500',
        'bg-yellow-500',
        'bg-violet-500',
        'bg-rose-500',
        'bg-stone-500',
        'hover:bg-teal-500',
        'hover:bg-orange-500',
        'hover:bg-sky-500',
        'hover:bg-yellow-500',
        'hover:bg-violet-500', 
        'hover:bg-rose-500',    
        'hover:bg-stone-500', 
    ]
};
