from pathlib import Path

p=Path('tools/.t0795/apply.py')
s=p.read_text()
start=s.index("old=\"    fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js')")
end=s.index("t=t.replace(old,new,1); tp.write_text(t)", start)+len("t=t.replace(old,new,1); tp.write_text(t)")
replacement=r'''import re
pattern=re.compile(r"    fs\.writeFileSync\(path\.join\(root, 'dist', 'cli', 'main\.js'\), `const fs = require\('node:fs'\);\\nif \(process\.argv\[2\] === 'version'\) console\.log\('0\.5\.0-rc\.6'\);\\nif \(process\.argv\[2\] === 'evidence' && process\.env\.EVIDENCE_LOG\) fs\.appendFileSync\(process\.env\.EVIDENCE_LOG, JSON\.stringify\(process\.argv\.slice\(2\)\) \+ '\\\\n'\);\\n`\);\n")
new="    fs.writeFileSync(path.join(root, 'dist', 'cli', 'main.js'), `const crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path');\\nif(process.argv[2]==='version')console.log('0.5.0-rc.6');\\nif(process.argv[2]==='evidence'&&process.argv[3]==='add-command'){const a=process.argv.slice(4),v=f=>{const i=a.indexOf(f);return i<0?undefined:a[i+1]},task=v('--task'),src=v('--artifact-file'),key=v('--idempotency-key');if(process.env.EVIDENCE_LOG)fs.appendFileSync(process.env.EVIDENCE_LOG,JSON.stringify(process.argv.slice(2))+'\\\\n');if(task&&src&&key){const td=path.join('tasks',fs.readdirSync('tasks').find(n=>n.startsWith(task+'-'))),dir=path.join(td,'artifacts','command-log');fs.mkdirSync(dir,{recursive:true});const dst=path.join(dir,path.basename(src)),b=fs.readFileSync(src);fs.writeFileSync(dst,b);const rel=path.relative(td,dst).split(path.sep).join('/'),sha='sha256:'+crypto.createHash('sha256').update(b).digest('hex'),r={schemaVersion:'hadara.evidence.v2',id:'ev:'+task+':fixture',taskId:task,visibility:'public',outcome:'passed',idempotencyKey:key,artifacts:[{path:rel,sha256:sha,byteLength:b.length}]};fs.appendFileSync(path.join(td,'evidence.jsonl'),JSON.stringify(r)+'\\\\n')}}}\\n`);\n"
t,n=pattern.subn(lambda _:new,t,count=1)
if n!=1: raise SystemExit(f'fixture cli regex: expected 1 match, got {n}')
tp.write_text(t)'''
s=s[:start]+replacement+s[end:]
p.write_text(s)
print('apply.py fixture matcher repaired')
