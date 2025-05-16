import { Head, Link } from '@inertiajs/react';
// Removed direct import of Mani to avoid duplicate import issues
import Navbar from './Common/Navbar';
import Footer from './Common/Footer';
import Homepage from './Common/cruise/Homepage';
export default function Welcome({ auth, laravelVersion, phpVersion,IternaryList }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        
        <>
        <Navbar/>
        <Homepage/>
{/*         
        <h1>Hello I'm Manindar Reddy Lakkireddy </h1>
        <p>I have  3 years of exp</p> */}
        
        <Footer/>
        </>
    );
}
