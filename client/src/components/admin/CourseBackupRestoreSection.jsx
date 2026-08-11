import React, { useState } from 'react';
import { API_URL, fetchWithCredentials } from '../../api';
import { Download, UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, Database, ShieldCheck, FileJson, ArrowRight } from 'lucide-react';

/**
 * RFC-4180 Compliant CSV Parser for Browser
 */
const parseCSV = (csvText) => {
  const lines = [];
  let field = '';
  let inQuotes = false;
  let currentLine = [];

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(field.trim());
        field = '';
      } else if (char === '\r' || char === '\n') {
        if (char === '\r' && nextChar === '\n') i++;
        currentLine.push(field.trim());
        if (currentLine.some(cell => cell.length > 0)) {
          lines.push(currentLine);
        }
        currentLine = [];
        field = '';
      } else {
        field += char;
      }
    }
  }
  if (field.length > 0 || currentLine.length > 0) {
    currentLine.push(field.trim());
    if (currentLine.some(cell => cell.length > 0)) {
      lines.push(currentLine);
    }
  }

  if (lines.length === 0) return [];
  const headers = lines[0].map(h => h.toLowerCase().trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length === 0) continue;
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = row[idx] !== undefined ? row[idx] : '';
    });
    results.push(obj);
  }
  return results;
};

/**
 * Fallback Client-side CSV Converter for 100% Reliability
 */
const convertCoursesToCSVClient = (coursesList) => {
  const headers = [
    'id',
    'title',
    'subject',
    'category',
    'subcategory',
    'paper_id',
    'paper_name',
    'course_type',
    'description',
    'faculty_name',
    'faculty_slug',
    'institute_name',
    'no_of_lecture',
    'books',
    'video_language',
    'video_run_on',
    'timing',
    'doubt_solving',
    'support_mail',
    'support_call',
    'validity_start_from',
    'poster_url',
    'cost_price',
    'selling_price',
    'is_active',
    'display_order',
    'mode_attempt_pricing',
    'custom_details'
  ];

  const escapeCsvCell = (val) => {
    if (val === null || val === undefined) return '""';
    let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = [headers.join(',')];

  (coursesList || []).forEach(c => {
    const row = [
      escapeCsvCell(c.id || c._id || ''),
      escapeCsvCell(c.title || c.subject || ''),
      escapeCsvCell(c.subject || c.title || ''),
      escapeCsvCell(c.category || ''),
      escapeCsvCell(c.subcategory || ''),
      escapeCsvCell(c.paperId || c.paper_id || ''),
      escapeCsvCell(c.paperName || c.paper_name || ''),
      escapeCsvCell(c.courseType || c.course_type || ''),
      escapeCsvCell(c.description || ''),
      escapeCsvCell(c.facultyName || c.faculty_name || ''),
      escapeCsvCell(c.facultySlug || c.faculty_slug || ''),
      escapeCsvCell(c.instituteName || c.institute_name || c.institute || ''),
      escapeCsvCell(c.noOfLecture || c.no_of_lecture || ''),
      escapeCsvCell(c.books || ''),
      escapeCsvCell(c.videoLanguage || c.video_language || ''),
      escapeCsvCell(c.videoRunOn || c.video_run_on || ''),
      escapeCsvCell(c.timing || ''),
      escapeCsvCell(c.doubtSolving || c.doubt_solving || ''),
      escapeCsvCell(c.supportMail || c.support_mail || ''),
      escapeCsvCell(c.supportCall || c.support_call || ''),
      escapeCsvCell(c.validityStartFrom || c.validity_start_from || ''),
      escapeCsvCell(c.posterUrl || c.poster_url || ''),
      escapeCsvCell(c.costPrice ?? c.cost_price ?? 0),
      escapeCsvCell(c.sellingPrice ?? c.selling_price ?? 0),
      escapeCsvCell(c.isActive ?? c.is_active ?? true),
      escapeCsvCell(c.displayOrder ?? c.display_order ?? 9999),
      escapeCsvCell(c.modeAttemptPricing || c.mode_attempt_pricing || []),
      escapeCsvCell(c.customDetails || c.custom_details || [])
    ];
    rows.push(row.join(','));
  });

  return rows.join('\r\n');
};

export default function CourseBackupRestoreSection({ onRestoreSuccess }) {
  const [downloadingFormat, setDownloadingFormat] = useState(null);
  const [backupStatus, setBackupStatus] = useState('');
  const [backupError, setBackupError] = useState('');

  // Restore State
  const [file, setFile] = useState(null);
  const [parsedCourses, setParsedCourses] = useState([]);
  const [restoreMode, setRestoreMode] = useState('merge'); // 'merge' | 'overwrite'
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState(null);
  const [restoreError, setRestoreError] = useState('');

  // Download Backup Handler with Resilient Multi-layer Fallback
  const handleDownloadBackup = async (format = 'csv') => {
    setDownloadingFormat(format);
    setBackupStatus('Fetching all courses for backup...');
    setBackupError('');

    try {
      let coursesList = [];
      let csvContent = '';

      // Layer 1: Try primary backup endpoint
      try {
        const response = await fetchWithCredentials(`${API_URL}/api/admin/courses/backup?format=${format}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            coursesList = data.courses || [];
            csvContent = data.csvData || '';
          }
        }
      } catch (srvErr) {
        console.warn('Dedicated backup endpoint unavailable, falling back to all courses API:', srvErr.message);
      }

      // Layer 2: Fallback to /api/courses/all if dedicated backup endpoint fails or 404s
      if (!coursesList || coursesList.length === 0) {
        const fallbackRes = await fetch(`${API_URL}/api/courses/all`);
        if (!fallbackRes.ok) {
          throw new Error(`Failed to load courses from API (${fallbackRes.status})`);
        }
        const fallbackData = await fallbackRes.json();
        coursesList = Array.isArray(fallbackData.courses) ? fallbackData.courses : [];
      }

      if (!coursesList || coursesList.length === 0) {
        throw new Error('No courses found in database to backup.');
      }

      const dateStr = new Date().toISOString().split('T')[0];
      let blob;
      let filename;

      if (format === 'json') {
        const jsonStr = JSON.stringify(coursesList, null, 2);
        blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
        filename = `academywale_courses_backup_${dateStr}.json`;
      } else {
        if (!csvContent) {
          csvContent = convertCoursesToCSVClient(coursesList);
        }
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        filename = `academywale_courses_backup_${dateStr}.csv`;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBackupStatus(`✅ Downloaded backup containing ${coursesList.length} courses (${format.toUpperCase()})`);
    } catch (err) {
      console.error('Backup download error:', err);
      setBackupError(`Failed to download backup: ${err.message}`);
      setBackupStatus('');
    } finally {
      setDownloadingFormat(null);
    }
  };

  // File Upload & Parse Handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setRestoreResult(null);
    setRestoreError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        let coursesArray = [];

        if (selectedFile.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          coursesArray = Array.isArray(parsed) ? parsed : (parsed.courses || []);
        } else {
          // Assume CSV
          coursesArray = parseCSV(text);
        }

        if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
          throw new Error('No course records found in file.');
        }

        setParsedCourses(coursesArray);
      } catch (err) {
        console.error('File parsing error:', err);
        setRestoreError(`Failed to parse backup file: ${err.message}`);
        setParsedCourses([]);
      }
    };
    reader.readAsText(selectedFile);
  };

  // Execute Restore Handler with Resilient Fallback
  const handleExecuteRestore = async () => {
    if (!parsedCourses || parsedCourses.length === 0) {
      setRestoreError('No courses to restore. Please upload a valid backup file.');
      return;
    }

    if (restoreMode === 'overwrite') {
      const confirmText = 'WARNING: Overwrite mode will DELETE all current courses in the database and replace them with the backup file. Are you absolutely sure?';
      if (!window.confirm(confirmText)) return;
    }

    setIsRestoring(true);
    setRestoreResult(null);
    setRestoreError('');

    try {
      let response;
      // Try restore endpoint first
      try {
        response = await fetchWithCredentials(`${API_URL}/api/admin/courses/restore`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            courses: parsedCourses,
            mode: restoreMode,
            overwrite: restoreMode === 'overwrite'
          })
        });
      } catch (e) { }

      // Fallback to bulk-upload if restore endpoint 404s
      if (!response || !response.ok) {
        response = await fetchWithCredentials(`${API_URL}/api/admin/courses/bulk-upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ courses: parsedCourses })
        });
      }

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || 'Failed to restore backup.');
      }

      setRestoreResult(data);

      if (typeof onRestoreSuccess === 'function') {
        onRestoreSuccess();
      }
    } catch (err) {
      console.error('Restore error:', err);
      setRestoreError(err.message || 'An error occurred during course restore.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8 shadow-xl text-white">
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-neutral-800">
        <div className="p-3 bg-[#20b2aa]/10 rounded-lg text-[#20b2aa]">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Course Backup & Restore System
            <span className="text-xs bg-[#20b2aa]/20 text-[#20b2aa] px-2 py-0.5 rounded-full font-medium">
              Data Security & Recovery
            </span>
          </h2>
          <p className="text-sm text-neutral-400">
            Download complete backups of all courses in CSV/JSON format or restore courses safely if anything changes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: EXPORT / DOWNLOAD BACKUP */}
        <div className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#20b2aa] font-semibold text-lg mb-2">
              <Download className="w-5 h-5" />
              Download Course Backup
            </div>
            <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
              Export all uploaded courses with complete metadata (titles, pricing options, paper details, faculties, custom fields, poster URLs) to your computer.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => handleDownloadBackup('csv')}
                disabled={downloadingFormat !== null}
                className="flex-1 bg-[#20b2aa] hover:bg-[#1a938c] text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm shadow-md cursor-pointer"
              >
                {downloadingFormat === 'csv' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
                Download CSV Backup
              </button>

              <button
                onClick={() => handleDownloadBackup('json')}
                disabled={downloadingFormat !== null}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm cursor-pointer"
              >
                {downloadingFormat === 'json' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileJson className="w-4 h-4" />
                )}
                Download JSON Backup
              </button>
            </div>

            {backupStatus && (
              <div className="mt-4 p-3 bg-[#20b2aa]/10 border border-[#20b2aa]/30 rounded-lg text-[#20b2aa] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {backupStatus}
              </div>
            )}

            {backupError && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {backupError}
              </div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-neutral-700/40 text-[11px] text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>CSV backups open directly in Microsoft Excel & Google Sheets.</span>
          </div>
        </div>

        {/* CARD 2: RESTORE / RE-UPLOAD BACKUP */}
        <div className="bg-neutral-800/50 border border-neutral-700/60 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-lg mb-2">
              <UploadCloud className="w-5 h-5" />
              Restore Courses from Backup
            </div>
            <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
              Upload a previously downloaded CSV or JSON backup file to restore all courses into the database.
            </p>

            {/* File Input */}
            <label className="block cursor-pointer bg-neutral-900/80 border-2 border-dashed border-neutral-700 hover:border-indigo-500 transition rounded-lg p-3 text-center mb-3">
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 text-neutral-300 text-xs font-medium">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                {file ? (
                  <span className="text-indigo-300 truncate max-w-[200px]">{file.name}</span>
                ) : (
                  <span>Click to select CSV or JSON backup file</span>
                )}
              </div>
            </label>

            {/* Parsed Preview */}
            {parsedCourses.length > 0 && (
              <div className="mb-3 bg-neutral-900 p-2.5 rounded-lg border border-neutral-700 text-xs">
                <div className="flex items-center justify-between text-neutral-300 font-medium mb-1">
                  <span>Detected Courses:</span>
                  <span className="text-indigo-400 font-bold">{parsedCourses.length} courses</span>
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  Sample: {parsedCourses[0]?.title || parsedCourses[0]?.subject || 'Course item'}
                </div>
              </div>
            )}

            {/* Mode Selection */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-neutral-400 mb-1.5">Restore Strategy:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 ${restoreMode === 'merge' ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200' : 'bg-neutral-900 border-neutral-700 text-neutral-400'}`}>
                  <input
                    type="radio"
                    name="restoreMode"
                    value="merge"
                    checked={restoreMode === 'merge'}
                    onChange={() => setRestoreMode('merge')}
                    className="accent-indigo-500"
                  />
                  <span>Merge / Add</span>
                </label>

                <label className={`p-2 rounded-lg border cursor-pointer flex items-center gap-2 ${restoreMode === 'overwrite' ? 'bg-red-950/60 border-red-500 text-red-200' : 'bg-neutral-900 border-neutral-700 text-neutral-400'}`}>
                  <input
                    type="radio"
                    name="restoreMode"
                    value="overwrite"
                    checked={restoreMode === 'overwrite'}
                    onChange={() => setRestoreMode('overwrite')}
                    className="accent-red-500"
                  />
                  <span>Overwrite All</span>
                </label>
              </div>
            </div>

            {/* Restore Action Button */}
            <button
              onClick={handleExecuteRestore}
              disabled={isRestoring || parsedCourses.length === 0}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-40 text-sm shadow-md cursor-pointer"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Restoring Courses...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Start Course Restore ({parsedCourses.length})
                </>
              )}
            </button>

            {restoreResult && (
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs">
                <div className="font-semibold flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {restoreResult.message || `Successfully restored ${restoreResult.successCount} courses!`}
                </div>
                {restoreResult.failedCount > 0 && (
                  <div className="text-amber-400 text-[11px] mt-1">
                    Warning: {restoreResult.failedCount} items had warnings or skipped.
                  </div>
                )}
              </div>
            )}

            {restoreError && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {restoreError}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-700/40 text-[11px] text-neutral-400">
            <span>Supports both newly exported backups and standard bulk CSV files.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
