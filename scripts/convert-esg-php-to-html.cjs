/**
 * Converts ESG report PHP pages to static HTML so they can be served from public/
 * without a PHP server. Run: node scripts/convert-esg-php-to-html.cjs
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const REPORT_DIRS = ['esg-report', 'esg-report-2023', 'esg-report-2024'];

// Strip PHP block at top of file
function stripPhpBlock(content) {
  return content.replace(/<\?[Pp]hp[\s\S]*?\?>\s*/m, '');
}

// Replace PHP conditionals with the "else" branch (static nav links without "active")
function stripPhpConditionals(content) {
  // Match: <?PHP if(...){ ?> ... <?PHP }else {?> ELSE_CONTENT <?PHP } ?>
  return content.replace(/\<\?PHP if\([^?]*\)\{ \?>[\s\S]*?\<\?PHP \}else \{\?\>([\s\S]*?)\<\?PHP \} \?\>/gi, '$1');
}

// Remove any remaining PHP tags
function stripRemainingPhp(content) {
  return content.replace(/\<\?[Pp][Hh][Pp][^?]*\?\>/g, '');
}

function phpToHtml(headerContent) {
  let out = stripPhpBlock(headerContent);
  out = stripPhpConditionals(out);
  out = stripRemainingPhp(out);
  // Convert .php extensions to .html
  // Note: The second replace was a no-op (replacing href="index.html" with itself), so it's been removed
  return out.replace(/\.php\b/g, '.html');
}

function convertReportDir(dirName) {
  const reportPath = path.join(PUBLIC_DIR, dirName);
  const includesPath = path.join(reportPath, 'includes');

  if (!fs.existsSync(reportPath) || !fs.existsSync(includesPath)) {
    console.warn('Skip (missing):', reportPath);
    return;
  }

  const headerPhp = fs.readFileSync(path.join(includesPath, 'header.php'), 'utf8');
  const footerPhp = fs.readFileSync(path.join(includesPath, 'footer.php'), 'utf8');
  const headerCss = fs.readFileSync(path.join(includesPath, 'header-css.php'), 'utf8');

  const headerHtml = phpToHtml(headerPhp);
  const footerHtml = footerPhp.replace(/\.php\b/g, '.html');
  const cssHtml = headerCss.replace(/<\?[^?]*\?>/g, '').trim();

  const navActiveScript = `
    <script>
    (function(){
      var p = (window.location.pathname.split('/').pop() || 'index.html').replace(/\\.html$/, '');
      if (p === 'index') p = '';
      document.querySelectorAll('.navbar a[href*=".html"]').forEach(function(a){
        var h = a.getAttribute('href') || '';
        var page = h.replace(/\\.html.*$/, '').replace(/^[^#]*#/, '');
        if (h === p + '.html' || h.indexOf(p + '.html') === 0 || (p === '' && (h === 'index.html' || h === '#'))) a.classList.add('active');
        else if (h.replace(/#.*$/, '') === p + '.html') a.classList.add('active');
      });
      document.querySelectorAll('.navbar .dropdown').forEach(function(drop){
        if (drop.querySelector('a.nav-link.active')) drop.querySelector('> a.nav-link').classList.add('active');
      });
    })();
    </script>`;

  const pagePhpFiles = fs.readdirSync(reportPath).filter((f) => f.endsWith('.php') && !f.startsWith('.'));

  for (const phpFile of pagePhpFiles) {
    const htmlFile = phpFile.replace(/\.php$/, '.html');
    let content = fs.readFileSync(path.join(reportPath, phpFile), 'utf8');

    content = content
      .replace(/\s*<\?PHP include\s*\(\s*["']includes\/header-css\.php["']\s*\)\s*;\s*\?>\s*/gi, '\n    ' + cssHtml.split('\n').join('\n    ') + '\n')
      .replace(/\s*<\?PHP include\s*\(\s*["']includes\/header\.php["']\s*\)\s*;\s*\?>\s*/gi, '\n    <!-- Navigation -->\n    ' + headerHtml.trim().split('\n').join('\n    ') + '\n    <!-- /Navigation -->')
      .replace(/\s*<\?PHP include\s*\(\s*["']includes\/footer\.php["']\s*\)\s*;\s*\?>\s*/gi, '\n    <!-- Footer -->\n    ' + footerHtml.trim().split('\n').join('\n    ') + '\n    <!-- /Footer -->');

    content = content.replace(/\.php\b/g, '.html');
    content = content.replace(/(<!-- \/Footer -->)/, '$1\n    ' + navActiveScript.trim());

    const outPath = path.join(reportPath, htmlFile);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log('  wrote', path.join(dirName, htmlFile));
  }

  console.log('Done:', dirName);
}

function main() {
  console.log('Converting ESG report PHP to HTML...\n');
  for (const dir of REPORT_DIRS) {
    convertReportDir(dir);
  }
  console.log('\nAll done. Access reports at /esg-report/, /esg-report-2023/, /esg-report-2024/ (use index.html or / for entry).');
}

main();
