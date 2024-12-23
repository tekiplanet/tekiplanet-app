<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class BusinessProfile extends Model
{
    use HasUuids;

    protected $fillable = [
        'business_name',
        'business_email',
        'phone_number',
        'registration_number',
        'tax_number',
        'website',
        'description',
        'address',
        'city',
        'state',
        'country',
        'status'
    ];

    protected $casts = [
        'status' => 'string'
    ];

    public function isActive()
    {
        return $this->status === 'active';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'business_id');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }
} 