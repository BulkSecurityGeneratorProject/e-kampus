package id.eara.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import org.springframework.data.elasticsearch.annotations.Document;


import org.hibernate.annotations.GenericGenerator;
import java.util.UUID;

import javax.persistence.*;
import java.io.Serializable;import java.util.Objects;

/**
 * atiila consulting
 * Class definition for Entity RegularCourse.
 */

@Entity
@Table(name = "regular_course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@Document(indexName = "regularcourse")
public class RegularCourse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @org.springframework.data.annotation.Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    @Column(name = "idcourse", columnDefinition = "BINARY(16)")
    private UUID idCourse;

    @Column(name = "course_code")
    private String courseCode;

    @Column(name = "description")
    private String description;

    @Column(name = "credit")
    private Integer credit;

    @ManyToOne
    @JoinColumn(name="idowner", referencedColumnName="idparrol")
    private Internal owner;

    public UUID getIdCourse() {
        return this.idCourse;
    }

    public void setIdCourse(UUID id) {
        this.idCourse = id;
    }


    public String getCourseCode() {
        return courseCode;
    }

    public RegularCourse courseCode(String courseCode) {
        this.courseCode = courseCode;
        return this;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getDescription() {
        return description;
    }

    public RegularCourse description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCredit() {
        return credit;
    }

    public RegularCourse credit(Integer credit) {
        this.credit = credit;
        return this;
    }

    public void setCredit(Integer credit) {
        this.credit = credit;
    }

    public Internal getOwner() {
        return owner;
    }

    public RegularCourse owner(Internal internal) {
        this.owner = internal;
        return this;
    }

    public void setOwner(Internal internal) {
        this.owner = internal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RegularCourse regularCourse = (RegularCourse) o;
        if (regularCourse.idCourse == null || this.idCourse == null) {
            return false;
        }
        return Objects.equals(this.idCourse, regularCourse.idCourse);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(this.idCourse);
    }

    @Override
    public String toString() {
        return "RegularCourse{" +
            "idCourse=" + this.idCourse +
            ", courseCode='" + getCourseCode() + "'" +
            ", description='" + getDescription() + "'" +
            ", credit='" + getCredit() + "'" +
            '}';
    }
}
