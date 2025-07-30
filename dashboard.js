async function loadDashboard() {
  try {
    const res = await fetch('/feedbacks');
    const data = await res.json();

    document.getElementById('totalFeedbacks').textContent = data.length;

    const ratings = data.map(f => f.rating);
    const average = (ratings.reduce((a, b) => a + b, 0) / data.length || 0).toFixed(1);
    document.getElementById('averageRating').textContent = `${average} ⭐`;

    const meals = data.map(f => f.meal);
    const mealCount = {};
    meals.forEach(m => mealCount[m] = (mealCount[m] || 0) + 1);
    const mostPopular = Object.entries(mealCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
    document.getElementById('popularMeal').textContent = mostPopular;

    const tableBody = document.getElementById('feedbackTable');
    tableBody.innerHTML = '';
    data.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="p-2">${f.name}</td>
        <td class="p-2">${f.meal}</td>
        <td class="p-2">${f.rating} ⭐</td>
        <td class="p-2">${f.feedback}</td>
      `;
      tableBody.appendChild(tr);
    });

    const ratingCounts = [1, 2, 3, 4, 5].map(r =>
      ratings.filter(val => val === r).length
    );

    const ctx = document.getElementById('ratingChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['1 ⭐', '2 ⭐', '3 ⭐', '4 ⭐', '5 ⭐'],
        datasets: [{
          label: 'Ratings Count',
          data: ratingCounts,
          backgroundColor: ['#ef4444', '#f97316', '#facc15', '#4ade80', '#22c55e']
        }]
      }
    });
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

loadDashboard();
