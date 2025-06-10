/* @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontSize: {
                'course-details-heading-large' : ['36px', '44px'],
                'course-details-heading-small' : ['26px', '36px']
            },
            maxWidth: {
                'course-card' : '424px'
            },
            boxShadow : {
                'custom-card' : '0px 4px 15px 2px rgba(0, 0, 0, 0.1)'
            }
        },
    },
    plugins: [],
};
