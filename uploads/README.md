# Local uploaded files

Store development uploads in `pets/` and `services/`. The folders are kept in the repository, but uploaded media is ignored by Git. The database `hinhanh` columns should contain a relative URL/path or a storage URL, not image binary data or a machine-specific absolute path.

This folder is only a storage location. Upload endpoints, file validation, and HTTP serving are not implemented yet. For deployment, use persistent shared/object storage and save its URL or object key in the database.
