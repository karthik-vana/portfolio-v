import Benchmark from 'benchmark';

const suite = new Benchmark.Suite;

const tools = [
    { name: "React", src: "/react.svg" },
    { name: "Vite", src: "/vite.svg" },
    { name: "Framer", src: "/framer_logo_icon_169149.webp" },
    { name: "Spline", src: "/spline_logo.webp" },
    { name: "Ollama", src: "/ollama-icon.webp", invert: true },
    { name: "Groq", src: "/groq_logo.webp" },
    { name: "HuggingFace", src: "/huggingface-color.webp" },
    { name: "Antigravity", src: "/antigravity.webp" },
];

const duplicatedTools = [...tools, ...tools];

suite.add('Spreading array inside (baseline)', function() {
    const arr = [...tools, ...tools];
    let sum = 0;
    arr.forEach(t => sum += t.name.length);
})
.add('Using pre-computed array (optimized)', function() {
    let sum = 0;
    duplicatedTools.forEach(t => sum += t.name.length);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });
