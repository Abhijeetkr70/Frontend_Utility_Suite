import store from './store.js';
import toast from './toast.js';

const WEATHER_KEY = 'weatherHistory';
const API_KEY_KEY = 'weatherApiKey';

const MOCK_DATA = {
  'New York': { temp: 22, condition: 'Partly Cloudy', icon: 'partly-cloudy', humidity: 65, wind: 12, uv: 5, feelsLike: 20, high: 25, low: 18 },
  'London': { temp: 15, condition: 'Light Rain', icon: 'rain', humidity: 78, wind: 18, uv: 2, feelsLike: 13, high: 17, low: 12 },
  'Tokyo': { temp: 28, condition: 'Clear Sky', icon: 'clear', humidity: 55, wind: 8, uv: 8, feelsLike: 30, high: 31, low: 24 },
  'Paris': { temp: 18, condition: 'Cloudy', icon: 'cloudy', humidity: 70, wind: 14, uv: 3, feelsLike: 17, high: 20, low: 14 },
  'Sydney': { temp: 26, condition: 'Sunny', icon: 'sunny', humidity: 45, wind: 10, uv: 9, feelsLike: 28, high: 30, low: 22 },
  'Dubai': { temp: 38, condition: 'Hot & Sunny', icon: 'sunny', humidity: 20, wind: 5, uv: 11, feelsLike: 42, high: 42, low: 34 },
  'Mumbai': { temp: 32, condition: 'Humid', icon: 'partly-cloudy', humidity: 82, wind: 6, uv: 7, feelsLike: 38, high: 34, low: 28 },
  'Singapore': { temp: 30, condition: 'Thunderstorms', icon: 'thunderstorm', humidity: 80, wind: 4, uv: 6, feelsLike: 35, high: 32, low: 26 },
  'Berlin': { temp: 16, condition: 'Drizzle', icon: 'rain', humidity: 72, wind: 16, uv: 3, feelsLike: 14, high: 18, low: 12 },
  'Toronto': { temp: 10, condition: 'Overcast', icon: 'cloudy', humidity: 68, wind: 20, uv: 2, feelsLike: 7, high: 12, low: 6 },
  'San Francisco': { temp: 17, condition: 'Foggy', icon: 'fog', humidity: 75, wind: 15, uv: 4, feelsLike: 15, high: 19, low: 13 },
  'Cairo': { temp: 35, condition: 'Clear', icon: 'clear', humidity: 15, wind: 8, uv: 10, feelsLike: 38, high: 38, low: 28 }
};

const FORECAST_MOCK = [
  { day: 'Mon', temp: 22, condition: 'Sunny', icon: 'sunny', high: 26, low: 18 },
  { day: 'Tue', temp: 20, condition: 'Partly Cloudy', icon: 'partly-cloudy', high: 24, low: 17 },
  { day: 'Wed', temp: 18, condition: 'Light Rain', icon: 'rain', high: 21, low: 15 },
  { day: 'Thu', temp: 19, condition: 'Cloudy', icon: 'cloudy', high: 22, low: 16 },
  { day: 'Fri', temp: 23, condition: 'Sunny', icon: 'sunny', high: 27, low: 19 }
];

function getWeatherIcon(icon, size = 'w-16 h-16') {
  const icons = {
    'clear': '<svg class="'+size+' text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    'sunny': '<svg class="'+size+' text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    'partly-cloudy': '<svg class="'+size+' text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>',
    'cloudy': '<svg class="'+size+' text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>',
    'rain': '<svg class="'+size+' text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>',
    'thunderstorm': '<svg class="'+size+' text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    'fog': '<svg class="'+size+' text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7h18M3 12h18M3 17h18"/></svg>'
  };
  return icons[icon] || icons['clear'];
}

function getConditionBg(icon) {
  const bgs = {
    'clear': 'from-amber-500/20 to-orange-500/20',
    'sunny': 'from-amber-500/20 to-orange-500/20',
    'partly-cloudy': 'from-slate-400/20 to-slate-500/20',
    'cloudy': 'from-slate-400/30 to-slate-500/30',
    'rain': 'from-blue-400/20 to-blue-500/20',
    'thunderstorm': 'from-purple-500/20 to-indigo-500/20',
    'fog': 'from-slate-300/20 to-slate-400/20'
  };
  return bgs[icon] || 'from-indigo-500/20 to-purple-500/20';
}

let currentCity = '';
let weatherData = null;
let forecastData = null;
let isLoading = false;

function renderWeather() {
  const history = store.get(WEATHER_KEY, []);
  const apiKey = store.get(API_KEY_KEY, '');

  const app = document.getElementById('app-content');
  app.innerHTML = `
    <div class="p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Weather Dashboard</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-1">Real-time weather for any city</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" id="weather-search" placeholder="Search city..." value="${currentCity}" class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
        </div>
        <button id="weather-search-btn" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          Search
        </button>
      </div>

      ${apiKey ? '' : `
        <details class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <summary class="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-500 transition-colors">Configure API Key (optional — mock data enabled by default)</summary>
          <div class="mt-3 flex gap-2">
            <input type="text" id="api-key-input" placeholder="Enter OpenWeatherMap API key" class="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none">
            <button id="save-api-key" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
          </div>
        </details>
      `}

      ${history.length ? `
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400">Recent:</span>
          ${history.map(city =>
            `<button class="history-chip px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" data-city="${city}">${city}</button>`
          ).join('')}
        </div>
      ` : ''}

      <div id="weather-content">
        ${isLoading ? `
          <div class="flex items-center justify-center py-20">
            <div class="flex flex-col items-center gap-4">
              <div class="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 rounded-full animate-spin"></div>
              <p class="text-sm text-slate-400 dark:text-slate-500">Fetching weather data...</p>
            </div>
          </div>
        ` : weatherData ? renderWeatherContent() : renderEmptyState()}
      </div>
    </div>
  `;

  attachWeatherListeners();
}

function renderEmptyState() {
  return `
    <div class="text-center py-20">
      <svg class="w-20 h-20 mx-auto text-slate-300 dark:text-slate-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
      <p class="text-slate-400 dark:text-slate-500 font-medium">Search for a city to see weather data</p>
      <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Try "New York", "London", "Tokyo", or any city you like</p>
    </div>
  `;
}

function renderWeatherContent() {
  if (!weatherData) return '';
  const w = weatherData;
  const bg = getConditionBg(w.icon);

  return `
    <div class="space-y-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 bg-gradient-to-br ${bg}">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div class="shrink-0">
            ${getWeatherIcon(w.icon)}
          </div>
          <div class="flex-1 text-center sm:text-left">
            <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">${currentCity}</h2>
              <span class="text-xs text-slate-400 dark:text-slate-500">Now</span>
            </div>
            <div class="text-5xl font-bold text-slate-900 dark:text-white mb-2">${w.temp}°<span class="text-2xl font-normal text-slate-400">C</span></div>
            <p class="text-slate-500 dark:text-slate-400 font-medium">${w.condition}</p>
            <p class="text-sm text-slate-400 dark:text-slate-500 mt-1">Feels like ${w.feelsLike}°C · H: ${w.high}° L: ${w.low}°</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div class="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <p class="text-xs text-slate-400 dark:text-slate-500 mb-1">Humidity</p>
              <p class="text-lg font-semibold text-slate-900 dark:text-white">${w.humidity}%</p>
            </div>
            <div class="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <p class="text-xs text-slate-400 dark:text-slate-500 mb-1">Wind</p>
              <p class="text-lg font-semibold text-slate-900 dark:text-white">${w.wind} km/h</p>
            </div>
            <div class="text-center p-3 rounded-xl bg-white/50 dark:bg-slate-800/50">
              <p class="text-xs text-slate-400 dark:text-slate-500 mb-1">UV Index</p>
              <p class="text-lg font-semibold text-slate-900 dark:text-white">${w.uv}</p>
            </div>
          </div>
        </div>
      </div>

      ${forecastData ? `
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">5-Day Forecast</h3>
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            ${forecastData.map(f => `
              <div class="flex-shrink-0 w-36 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">${f.day}</p>
                ${getWeatherIcon(f.icon, 'w-10 h-10')}
                <p class="text-xl font-bold text-slate-900 dark:text-white mt-2">${f.temp}°</p>
                <p class="text-xs text-slate-400 dark:text-slate-500">H: ${f.high}° L: ${f.low}°</p>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">${f.condition}</p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function attachWeatherListeners() {
  const container = document.getElementById('app-content');

  container.addEventListener('click', (e) => {
    if (e.target.id === 'weather-search-btn' || (e.target.closest('#weather-search-btn'))) {
      const input = document.getElementById('weather-search');
      if (input && input.value.trim()) searchCity(input.value.trim());
    }

    const chip = e.target.closest('.history-chip');
    if (chip) searchCity(chip.dataset.city);

    if (e.target.id === 'save-api-key' || e.target.closest('#save-api-key')) {
      const input = document.getElementById('api-key-input');
      if (input && input.value.trim()) {
        store.set(API_KEY_KEY, input.value.trim());
        toast.success('API key saved');
        renderWeather();
      }
    }
  });

  const searchInput = document.getElementById('weather-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) searchCity(searchInput.value.trim());
    });
  }
}

async function searchCity(city) {
  currentCity = city.trim();
  isLoading = true;
  renderWeather();

  const apiKey = store.get(API_KEY_KEY, '');

  try {
    if (apiKey) {
      await fetchRealWeather(city, apiKey);
    } else {
      await fetchMockWeather(city);
    }
  } catch (err) {
    toast.error('Failed to fetch weather data');
    await fetchMockWeather(city);
  }

  isLoading = false;
  renderWeather();
}

async function fetchRealWeather(city, apiKey) {
  const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`);
  if (!geoRes.ok) throw new Error('City not found');
  const geoData = await geoRes.json();
  if (!geoData.length) throw new Error('City not found');

  const { lat, lon } = geoData[0];

  const [weatherRes, forecastRes] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
  ]);

  if (!weatherRes.ok || !forecastRes.ok) throw new Error('API error');

  const weatherDataRaw = await weatherRes.json();
  const forecastDataRaw = await forecastRes.json();

  weatherData = {
    temp: Math.round(weatherDataRaw.main.temp),
    feelsLike: Math.round(weatherDataRaw.main.feels_like),
    high: Math.round(weatherDataRaw.main.temp_max),
    low: Math.round(weatherDataRaw.main.temp_min),
    humidity: weatherDataRaw.main.humidity,
    wind: Math.round(weatherDataRaw.wind.speed * 3.6),
    uv: 5,
    condition: weatherDataRaw.weather[0].main,
    icon: mapApiIcon(weatherDataRaw.weather[0].icon)
  };

  const dailyForecasts = forecastDataRaw.list.filter((_, i) => i % 8 === 0).slice(0, 5);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  forecastData = dailyForecasts.map((f, i) => ({
    day: dayNames[new Date(f.dt * 1000).getDay()],
    temp: Math.round(f.main.temp),
    high: Math.round(f.main.temp_max),
    low: Math.round(f.main.temp_min),
    condition: f.weather[0].main,
    icon: mapApiIcon(f.weather[0].icon)
  }));

  addToHistory(city);
}

function mapApiIcon(iconCode) {
  const map = {
    '01d': 'clear', '01n': 'clear',
    '02d': 'partly-cloudy', '02n': 'partly-cloudy',
    '03d': 'cloudy', '03n': 'cloudy',
    '04d': 'cloudy', '04n': 'cloudy',
    '09d': 'rain', '09n': 'rain',
    '10d': 'rain', '10n': 'rain',
    '11d': 'thunderstorm', '11n': 'thunderstorm',
    '13d': 'clear', '13n': 'clear',
    '50d': 'fog', '50n': 'fog'
  };
  return map[iconCode] || 'partly-cloudy';
}

async function fetchMockWeather(city) {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

  const normalized = Object.keys(MOCK_DATA).find(
    k => k.toLowerCase() === city.toLowerCase()
  );

  if (normalized) {
    const d = MOCK_DATA[normalized];
    weatherData = { ...d };
    currentCity = normalized;
    addToHistory(normalized);
  } else {
    weatherData = {
      temp: Math.round(15 + Math.random() * 20),
      feelsLike: Math.round(12 + Math.random() * 18),
      high: Math.round(20 + Math.random() * 15),
      low: Math.round(8 + Math.random() * 12),
      humidity: Math.round(30 + Math.random() * 50),
      wind: Math.round(3 + Math.random() * 25),
      uv: Math.round(1 + Math.random() * 10),
      condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'][Math.floor(Math.random() * 5)],
      icon: ['sunny', 'partly-cloudy', 'cloudy', 'rain', 'clear'][Math.floor(Math.random() * 5)]
    };
    currentCity = city;
    addToHistory(city);
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
  const icons = ['sunny', 'partly-cloudy', 'cloudy', 'rain', 'clear'];
  forecastData = FORECAST_MOCK.map((f, i) => ({
    ...f,
    day: dayNames[(today + i + 1) % 7],
    temp: Math.round(weatherData.temp + (Math.random() - 0.5) * 8),
    high: Math.round(weatherData.high + (Math.random() - 0.5) * 4),
    low: Math.round(weatherData.low + (Math.random() - 0.5) * 4),
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    icon: icons[Math.floor(Math.random() * icons.length)]
  }));
}

function addToHistory(city) {
  let history = store.get(WEATHER_KEY, []);
  history = history.filter(c => c.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  if (history.length > 5) history = history.slice(0, 5);
  store.set(WEATHER_KEY, history);
}

function renderWeatherDashboard() {
  weatherData = null;
  forecastData = null;
  isLoading = false;
  renderWeather();
}

export { renderWeatherDashboard };
