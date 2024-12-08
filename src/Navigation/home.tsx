// Home.tsx
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import "../index.css";

export default function Home() {
    return (
        <div className="card w-50">
            <div className="card-body">
                <img src="\images\happyCapStartPhoto.JPG" className="card-img rounded img-fluid" alt="HappyCap Start" />
                <h5 className="card-title">
                    HappyCap is a multimedia journaling platform where you can capture your moments with images, videos, etc, then lock them for future rediscovery.
                </h5>
                {/* Use Link to navigate to the Canvas page (New Entry page) */}
                <Link to="/Journal" className="btn btn-dark rounded-pill float-end">Get Started</Link>
            </div>
        </div>
    );
}
