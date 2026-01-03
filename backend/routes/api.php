<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Projects API
Route::get('/projects', function () {
    return response()->json([
        [
            'id' => 1,
            'title' => 'E-Commerce Platform',
            'description' => 'Full-stack e-commerce solution with React and Laravel',
            'image' => 'https://via.placeholder.com/400x250',
            'technologies' => ['React', 'Laravel', 'MySQL', 'Tailwind CSS'],
            'github' => 'https://github.com',
            'demo' => 'https://demo.com'
        ],
        [
            'id' => 2,
            'title' => 'Task Management App',
            'description' => 'Collaborative task management with real-time updates',
            'image' => 'https://via.placeholder.com/400x250',
            'technologies' => ['Vue.js', 'Node.js', 'Socket.io', 'MongoDB'],
            'github' => 'https://github.com',
            'demo' => 'https://demo.com'
        ],
        [
            'id' => 3,
            'title' => 'Weather Dashboard',
            'description' => 'Beautiful weather app with location-based forecasts',
            'image' => 'https://via.placeholder.com/400x250',
            'technologies' => ['React', 'OpenWeather API', 'Chart.js'],
            'github' => 'https://github.com',
            'demo' => 'https://demo.com'
        ],
        [
            'id' => 4,
            'title' => 'Portfolio Website',
            'description' => 'Modern portfolio with dark mode and animations',
            'image' => 'https://via.placeholder.com/400x250',
            'technologies' => ['React', 'Framer Motion', 'Tailwind CSS'],
            'github' => 'https://github.com',
            'demo' => 'https://demo.com'
        ]
    ]);
});

// Contact API
Route::post('/contact', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'subject' => 'required|string|max:255',
        'message' => 'required|string'
    ]);

    // Here you would typically send an email or save to database
    // For now, just return success
    return response()->json([
        'message' => 'Thank you! Your message has been sent successfully.',
        'data' => $validated
    ]);
});