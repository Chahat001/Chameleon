package com.example.uploadingfiles;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface FileRepository extends CrudRepository<File, Integer> {

    @Query(value = "SELECT * FROM file LIMIT 20",
            nativeQuery = true)
    Iterable<File> find20Files();
}
