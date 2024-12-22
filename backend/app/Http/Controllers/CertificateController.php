<?php

namespace App\Http\Controllers;

use App\Models\CourseCertificate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CertificateController extends Controller
{
    /**
     * Get user's certificates with course and instructor details
     */
    public function getUserCertificates(Request $request)
    {
        try {
            $certificates = CourseCertificate::with(['course', 'course.instructor'])
                ->where('user_id', Auth::id())
                ->latest('issue_date')
                ->get()
                ->map(function ($certificate) {
                    return [
                        'id' => $certificate->id,
                        'title' => $certificate->title,
                        'issue_date' => $certificate->issue_date->toISOString(),
                        'image' => $certificate->course->image_url ?? null,
                        'grade' => $certificate->grade,
                        'instructor' => $certificate->course->instructor->full_name ?? 'Unknown Instructor',
                        'credential_id' => $certificate->credential_id,
                        'skills' => $certificate->skills,
                        'featured' => $certificate->featured
                    ];
                });

            $stats = [
                'total' => $certificates->count(),
                'featured' => $certificates->where('featured', true)->count(),
                'top_grades' => $certificates->whereIn('grade', ['A+', 'A'])->count(),
                'total_skills' => $certificates->pluck('skills')->flatten()->unique()->count()
            ];

            return response()->json([
                'certificates' => $certificates,
                'stats' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch certificates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle featured status of a certificate
     */
    public function toggleFeatured(Request $request, string $id)
    {
        try {
            $certificate = CourseCertificate::where('user_id', Auth::id())
                ->findOrFail($id);

            $certificate->featured = !$certificate->featured;
            $certificate->save();

            return response()->json([
                'message' => 'Certificate featured status updated',
                'featured' => $certificate->featured
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update certificate',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download certificate
     */
    public function download(Request $request, string $id)
    {
        try {
            $certificate = CourseCertificate::where('user_id', Auth::id())
                ->with(['course', 'user'])
                ->findOrFail($id);

            // TODO: Generate PDF certificate
            return response()->json([
                'message' => 'Certificate download not implemented yet'
            ], 501);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to download certificate',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 