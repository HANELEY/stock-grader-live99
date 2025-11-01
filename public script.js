document.getElementById("searchBtn").addEventListener("click", async () => {
  const symbol = document.getElementById("symbolInput").value.trim();
  const resultDiv = document.getElementById("result");
  if (!symbol) {
    resultDiv.innerHTML = "<p>Please enter a symbol.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`/api/quote?symbol=${symbol}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    resultDiv.innerHTML = `
      <div class="card">
        <h2>${data.name} (${data.symbol})</h2>
        <p><strong>Price:</strong> ${data.price} ${data.currency}</p>
        <p><strong>Market Cap:</strong> ${data.marketCap?.toLocaleString()}</p>
        <p><strong>EPS:</strong> ${data.eps}</p>
        <p><strong>P/E Ratio:</strong> ${data.pe}</p>
        <p><strong>Volume:</strong> ${data.volume?.toLocaleString()}</p>
        <p class="grade">Grade: <span class="${data.grade}">${data.grade}</span></p>
      </div>`;
  } catch (err) {
    resultDiv.innerHTML = `<p class="error">${err.message}</p>`;
  }
});
