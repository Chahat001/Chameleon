package com.example.uploadingfiles;

import javax.persistence.*;

import lombok.Data;

@Data
@Entity
public class File {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer file_id;

    @Column(unique=true)
    private String file_name;

    private Status file_result;
}
