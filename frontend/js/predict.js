import { fetchMetadata, predictColleges } from './api.js';
import { savePrediction, getUserProfile } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('predictionForm');
  const courseSelect = document.getElementById('courseSelection');
  const yearSelect = document.getElementById('admissionYear');
  const percentileInput = document.getElementById('percentileInput');
  const categorySelect = document.getElementById('categorySelection');
  const candidateTypeSelect = document.getElementById('candidateTypeSelection');
  const universitySelect = document.getElementById('homeUniversitySelection');
  const districtSelect = document.getElementById('districtSelection');
  const submitBtn = document.getElementById('submitBtn');
  const errorAlert = document.getElementById('errorAlert');

  // Interactive Gender Selection
  let selectedGender = 'Male';
  const maleBtn = document.getElementById('genderMaleBtn');
  const femaleBtn = document.getElementById('genderFemaleBtn');

  maleBtn?.addEventListener('click', () => {
    selectedGender = 'Male';
    maleBtn.className = 'flex-1 py-sm md:py-md px-md rounded-xl border border-primary bg-primary-container/10 text-primary font-bold transition-all text-center h-11 md:h-12 text-xs md:text-sm flex items-center justify-center';
    femaleBtn.className = 'flex-1 py-sm md:py-md px-md rounded-xl border border-outline-variant bg-white text-secondary font-medium transition-all text-center hover:border-primary h-11 md:h-12 text-xs md:text-sm flex items-center justify-center';
  });

  femaleBtn?.addEventListener('click', () => {
    selectedGender = 'Female';
    femaleBtn.className = 'flex-1 py-sm md:py-md px-md rounded-xl border border-primary bg-primary-container/10 text-primary font-bold transition-all text-center h-11 md:h-12 text-xs md:text-sm flex items-center justify-center';
    maleBtn.className = 'flex-1 py-sm md:py-md px-md rounded-xl border border-outline-variant bg-white text-secondary font-medium transition-all text-center hover:border-primary h-11 md:h-12 text-xs md:text-sm flex items-center justify-center';
  });



  const branchSelect = document.getElementById('branchSelection');

  async function updateBranches(course) {
    if (!branchSelect) return;
    try {
      const meta = await fetchMetadata(course);
      if (meta.branches && meta.branches.length > 0) {
        branchSelect.innerHTML = `<option value="All">All Branches</option>` +
          meta.branches.map(b => `<option value="${b}">${b}</option>`).join('');
      } else {
        branchSelect.innerHTML = `<option value="All">All Branches</option>`;
      }
    } catch (err) {
      console.warn('Branch update failed:', err);
    }
  }

  courseSelect?.addEventListener('change', (e) => {
    updateBranches(e.target.value);
  });

  // Fetch initial Metadata options & Auto-fill saved settings profile
  try {
    const meta = await fetchMetadata(courseSelect ? courseSelect.value : '');

    if (meta.categories && meta.categories.length > 0) {
      categorySelect.innerHTML = meta.categories.map(c => `
        <option value="${c}">${c}</option>
      `).join('');
    }

    if (meta.universities && meta.universities.length > 0) {
      universitySelect.innerHTML = `<option value="All">All Universities</option>` +
        meta.universities.map(u => `<option value="${u}">${u}</option>`).join('');
    }

    if (meta.districts && meta.districts.length > 0) {
      districtSelect.innerHTML = `<option value="All">All Districts</option>` +
        meta.districts.map(d => `<option value="${d}">${d}</option>`).join('');
    }

    if (courseSelect) {
      await updateBranches(courseSelect.value);
    }

    // Auto-fill from saved profile settings for new user
    const profile = getUserProfile();
    if (profile) {
      if (profile.category) categorySelect.value = profile.category;
      if (profile.homeUniversity) universitySelect.value = profile.homeUniversity;
      if (profile.percentile && !percentileInput.value) percentileInput.value = profile.percentile;
    }
  } catch (err) {
    console.warn('Metadata loading fallback used:', err);
  }

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorAlert.classList.add('hidden');

    const pct = parseFloat(percentileInput.value);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      errorAlert.textContent = 'Please enter a valid MHT CET percentile between 0 and 100.';
      errorAlert.classList.remove('hidden');
      return;
    }

    const payload = {
      course: courseSelect.value,
      academic_year: yearSelect.value,
      percentile: pct,
      category: categorySelect.value,
      candidate_type: candidateTypeSelect.value,
      gender: selectedGender,
      home_university: universitySelect.value,
      district: districtSelect.value,
      preferred_branch: branchSelect && branchSelect.value ? [branchSelect.value] : ['All'],
    };


    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span><span>Analyzing Cutoff Data...</span>`;

    try {
      const result = await predictColleges(payload);
      savePrediction(payload, result);
      window.location.href = '/results.html';
    } catch (err) {
      errorAlert.textContent = err.message || 'Prediction failed. Please check your backend connection.';
      errorAlert.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-xl md:text-2xl">analytics</span><span>Predict My Colleges</span>`;
    }
  });
});
