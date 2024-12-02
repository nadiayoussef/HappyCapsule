import React, { useRef, useState, useEffect } from 'react';
import "../index.css"
export default function Home() {
    return (
        <div className="card w-50">
                <div className="card-body">
                    <img src="\images\happyCapStartPhoto.JPG" className="card-img rounded img-fluid"/>
                    <h5 className="card-title">HappyCap is a multimedia journaling platform where you can capture your moments with images, videos, etc, then lock them for future rediscovery.</h5>
                    <a href="#" className="btn btn-dark rounded-pill float-end">Get Started</a>
                </div>
        </div>
    );
}