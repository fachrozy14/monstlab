-- Optional seed data
insert into jobs(title) values ('Frontend Developer'), ('Data Analyst') on conflict do nothing;
insert into tools(job_id, name, description)
values
  (1, 'Vite', 'Fast dev server and bundler'),
  (1, 'ESLint', 'Linting for JS/TS'),
  (2, 'Pandas', 'Python data analysis library');
