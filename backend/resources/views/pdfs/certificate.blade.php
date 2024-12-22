<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Certificate of Completion</title>
    <style>
        @page {
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'DejaVu Sans', sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #333;
            position: relative;
        }
        .certificate {
            width: 100%;
            height: 100%;
            padding: 40px;
            box-sizing: border-box;
            position: relative;
            text-align: center;
        }
        .border {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid #ddd;
        }
        .content {
            position: relative;
            z-index: 1;
            padding: 20px;
        }
        .logo {
            margin-bottom: 30px;
        }
        .logo img {
            height: 60px;
        }
        .certificate-title {
            font-size: 42px;
            color: #2563eb;
            margin-bottom: 30px;
            font-weight: bold;
        }
        .recipient-name {
            font-size: 32px;
            margin-bottom: 20px;
            color: #333;
        }
        .completion-text {
            font-size: 18px;
            margin-bottom: 20px;
            color: #666;
            line-height: 1.6;
        }
        .course-name {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            font-weight: bold;
            padding: 0 40px;
        }
        .grade {
            font-size: 20px;
            color: #2563eb;
            margin-bottom: 15px;
        }
        .date {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
        }
        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 40px;
            padding: 0 60px;
        }
        .signature {
            text-align: center;
            width: 200px;
        }
        .signature-line {
            width: 100%;
            border-bottom: 1px solid #333;
            margin-bottom: 10px;
        }
        .signature-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .signature-title {
            font-size: 14px;
            color: #666;
        }
        .certificate-footer {
            position: absolute;
            bottom: 40px;
            left: 0;
            right: 0;
            text-align: center;
        }
        .credential-id {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
        }
        .qr-code {
            margin: 0 auto;
            width: 80px;
            height: 80px;
        }
        .qr-code img {
            width: 100%;
            height: 100%;
        }
        .skills {
            margin: 20px auto;
            max-width: 80%;
            font-size: 14px;
            color: #666;
        }
        .skill-badge {
            display: inline-block;
            padding: 4px 12px;
            margin: 3px;
            background: #f0f7ff;
            border-radius: 12px;
            color: #2563eb;
            font-size: 12px;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 150px;
            color: rgba(37, 99, 235, 0.03);
            white-space: nowrap;
            z-index: 0;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="border"></div>
        <div class="watermark">TEKIPLANET</div>
        
        <div class="content">
            <div class="logo">
                <img src="{{ public_path('images/logo.png') }}" alt="Logo">
            </div>

            <div class="certificate-title">Certificate of Completion</div>

            <div class="recipient-name">{{ $user->first_name }} {{ $user->last_name }}</div>

            <div class="completion-text">
                has successfully completed the course
            </div>

            <div class="course-name">{{ $course->title }}</div>

            <div class="grade">Grade: {{ $certificate->grade }}</div>

            <div class="date">
                Issued on {{ $certificate->issue_date->format('F d, Y') }}
            </div>

            <div class="skills">
                Skills Earned:
                @foreach($certificate->skills as $skill)
                    <span class="skill-badge">{{ $skill }}</span>
                @endforeach
            </div>

            <div class="signatures">
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-name">{{ $instructor->full_name }}</div>
                    <div class="signature-title">Course Instructor</div>
                </div>
                <div class="signature">
                    <div class="signature-line"></div>
                    <div class="signature-name">John Doe</div>
                    <div class="signature-title">Director of Education</div>
                </div>
            </div>

            <div class="certificate-footer">
                <div class="credential-id">Certificate ID: {{ $certificate->credential_id }}</div>
                <div class="qr-code">
                    {!! $qrCode !!}
                </div>
            </div>
        </div>
    </div>
</body>
</html> 